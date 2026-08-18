using System.Threading.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Numinds.Api.Data;
using Numinds.Api.Models.Entities;
using Numinds.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Free hosts (Render, Railway, Fly...) inject the port to listen on via PORT
// instead of ASPNETCORE_URLS. Falls back to the SDK's normal binding
// (launchSettings.json locally, 8080 in a container) when it's unset.
var hostingPort = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(hostingPort))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{hostingPort}");
}

// ---- CORS -------------------------------------------------------------
// The Next.js client sends credentials: "include" (see src/lib/api/client.ts),
// so the allowed origin must be explicit — AllowAnyOrigin() can't be
// combined with AllowCredentials().
const string CorsPolicyName = "NextJsClient";
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:3000"];

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// ---- Database -----------------------------------------------------------
// Database:Provider selects Postgres, SqlServer, or Sqlite; the matching
// entry under ConnectionStrings supplies the connection string. Sqlite is a
// zero-install default for local development — see appsettings.Development.json.
var databaseProvider = builder.Configuration["Database:Provider"] ?? "Sqlite";

// Pooled (vs. plain AddDbContext) so instances are reused across requests
// instead of reconstructed every time — matters once request volume grows.
// NumindsDbContext carries no per-request mutable state of its own, so
// pooling is safe. EnableRetryOnFailure absorbs the transient network blips
// a remote Postgres/SQL Server will occasionally see in production instead
// of surfacing them as hard 500s; there's no explicit BeginTransaction
// anywhere in the app, so the retrying execution strategy has nothing to
// conflict with. Sqlite (local dev only) has no equivalent option.
builder.Services.AddDbContextPool<NumindsDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString(databaseProvider)
        ?? throw new InvalidOperationException(
            $"Missing connection string for provider '{databaseProvider}'. " +
            $"Set ConnectionStrings:{databaseProvider} in appsettings.json.");

    switch (databaseProvider)
    {
        case "Postgres":
            // Bounded (not the 6-retry/30s-delay default) — Neon's monitoring
            // showed repeated bursts of ~900 concurrent connections over a
            // single day, which is consistent with every concurrent request
            // independently retrying a struggling/quota-limited database up
            // to 6 times each, compounding into a connection storm right
            // when the database is least able to absorb it. 3 retries over
            // at most ~6s still absorbs genuine transient network blips
            // without piling on this hard during a real outage.
            options.UseNpgsql(connectionString, npgsql => npgsql.EnableRetryOnFailure(
                maxRetryCount: 3, maxRetryDelay: TimeSpan.FromSeconds(6), errorCodesToAdd: null));
            break;
        case "SqlServer":
            options.UseSqlServer(connectionString, sql => sql.EnableRetryOnFailure());
            break;
        case "Sqlite":
            // Migrations are generated against Postgres (the production
            // provider) so their column types/annotations are Npgsql-native
            // and will never byte-for-byte match Sqlite's own type mappings.
            // That's a permanent, expected mismatch between two providers
            // sharing one migration history — not real schema drift — so the
            // check is suppressed here. It stays enabled for Postgres/SQL
            // Server below, where it still catches genuine drift, and this
            // provider only ever touches the disposable local dev.db.
            options.UseSqlite(connectionString);
            options.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
            break;
        default:
            throw new InvalidOperationException(
                $"Unknown Database:Provider '{databaseProvider}'. Use Postgres, SqlServer, or Sqlite.");
    }
});

// ---- Identity (cookie auth) --------------------------------------------
builder.Services
    .AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
    {
        options.Password.RequiredLength = 8;
        options.Password.RequireNonAlphanumeric = false;
        options.User.RequireUniqueEmail = true;
    })
    .AddEntityFrameworkStores<NumindsDbContext>()
    .AddDefaultTokenProviders();

// Google sign-in is only registered once real credentials are configured
// (via `dotnet user-secrets`) — until then "Continue with Google" 404s
// instead of crashing the app at startup with a blank ClientId.
var googleClientId = builder.Configuration["Authentication:Google:ClientId"];
var googleClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
if (!string.IsNullOrWhiteSpace(googleClientId) && !string.IsNullOrWhiteSpace(googleClientSecret))
{
    builder.Services.AddAuthentication().AddGoogle(options =>
    {
        options.ClientId = googleClientId;
        options.ClientSecret = googleClientSecret;
        options.SignInScheme = IdentityConstants.ExternalScheme;
    });
}

builder.Services.AddHttpClient<IEmailSender, ResendEmailSender>();

// R2 (Cloudflare's S3-compatible object storage) for admin-uploaded images
// (partner logos, template covers, envelope photos, thank-you-suggestion
// cards) -- Render's own filesystem is ephemeral and wipes anything written
// to it on the next deploy/restart, which is what silently broke uploads
// before this. See R2FileStorageService for the fallback behavior while
// Storage:R2:* isn't configured yet.
builder.Services.AddSingleton<IFileStorageService, R2FileStorageService>();

builder.Services.ConfigureApplicationCookie(options =>
{
    // Browsers scope SameSite by registrable domain, not host/port, so
    // frontend (localhost:3000) and API (localhost:5000) count as the same
    // site locally, and so would e.g. app.numinds.me + api.numinds.me in
    // production. SameSite=Lax + Secure=SameAsRequest (Identity's default)
    // works for that case without requiring HTTPS everywhere. Free-tier
    // hosting (Vercel + Render/Railway) puts the frontend and API on two
    // genuinely different registrable domains (*.vercel.app / *.onrender.com),
    // which Lax cookies won't survive — None+Always is required there, and
    // both hosts serve HTTPS by default so the Secure requirement is met.
    if (builder.Environment.IsDevelopment())
    {
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    }
    else
    {
        options.Cookie.SameSite = SameSiteMode.None;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    }

    // This is an API, not a page app — return status codes instead of
    // redirecting to a (nonexistent) login page.
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});

// ---- Rate limiting -------------------------------------------------------
// Partitioned per client IP so one abusive caller can't exhaust the limit
// for everyone else. "auth" is deliberately tight — it covers login,
// register, forgot/reset-password, all of which are unauthenticated and
// otherwise wide open to brute-force/credential-stuffing/spam-signup. The
// global limiter is a generous catch-all safety net for every other
// endpoint (order/review/partner-application submission included).
const string AuthRateLimitPolicy = "auth";

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                Window = TimeSpan.FromMinutes(1),
                PermitLimit = 120,
                QueueLimit = 0,
            }));

    options.AddPolicy(AuthRateLimitPolicy, context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                Window = TimeSpan.FromMinutes(1),
                PermitLimit = 8,
                QueueLimit = 0,
            }));
});

// ---- Response compression ------------------------------------------------
// Every JSON response (and the uploaded-image static files below) currently
// goes over the wire uncompressed. This is a JSON API served only to our own
// frontend over HTTPS in production — no third-party reflected secrets in
// the body — so the usual BREACH-attack caveat against compressing dynamic
// HTTPS responses doesn't apply here the way it would for a page that mixes
// a CSRF token with attacker-controlled input.
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Render/Railway-style hosts terminate HTTPS at their edge and forward to
// this container over plain HTTP, so Request.Scheme would read "http" here
// without this — tripping UseHttpsRedirection below into redirect-looping
// every request. The proxy's IP isn't knowable ahead of time (unlike an
// on-prem load balancer), so the known-network allowlist is cleared to trust
// the forwarded header from any hop; safe because the platform's edge is the
// only thing that can reach this container directly.
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
    KnownNetworks = { },
    KnownProxies = { },
});

// If wwwroot doesn't exist yet at startup (first run — nothing's been
// uploaded), IWebHostEnvironment.WebRootFileProvider binds to a
// NullFileProvider and UseStaticFiles() below silently 404s forever, even
// after PartnersController.UploadLogo creates the directory later. Ensure
// it exists and rebind the provider before wiring the middleware.
var webRootPath = app.Environment.WebRootPath ?? Path.Combine(app.Environment.ContentRootPath, "wwwroot");
Directory.CreateDirectory(Path.Combine(webRootPath, "uploads", "partners"));
app.Environment.WebRootPath = webRootPath;
app.Environment.WebRootFileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(webRootPath);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Skip the HTTPS redirect/HSTS in Development so the app can run over plain
// HTTP locally (avoids every client needing to trust the ASP.NET Core
// dev certificate). Enforce both everywhere else.
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

// ---- Security headers -----------------------------------------------------
// Baseline hardening headers on every response. This is a JSON API (no
// inline scripts/styles of its own to allow-list), so the CSP is locked
// down to "nothing loads" by default.
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'");
    await next();
});

// Must run before anything writes to the response body (CORS, static files,
// controllers) per ASP.NET Core's documented response-compression ordering.
app.UseResponseCompression();

app.UseCors(CorsPolicyName);

// Serves uploaded partner logos (wwwroot/uploads/partners) back over HTTP —
// see PartnersController.UploadLogo.
app.UseStaticFiles();

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<NumindsDbContext>();
    await db.Database.MigrateAsync();
    // The demo@numinds.me / Passw0rd!23 account exists purely so the API can
    // be exercised (Swagger etc.) before a real sign-up flow existed on the
    // frontend — a real one has existed for a while now, and this well-known
    // credential must never be reachable on a production deployment.
    if (app.Environment.IsDevelopment())
    {
        await SeedIdentity.RunAsync(scope.ServiceProvider);
    }
    await SeedIdentity.RunAdminRoleSeedAsync(scope.ServiceProvider);
}

app.Run();
