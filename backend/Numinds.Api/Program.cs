using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Numinds.Api.Data;
using Numinds.Api.Models.Entities;

var builder = WebApplication.CreateBuilder(args);

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

builder.Services.AddDbContext<NumindsDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString(databaseProvider)
        ?? throw new InvalidOperationException(
            $"Missing connection string for provider '{databaseProvider}'. " +
            $"Set ConnectionStrings:{databaseProvider} in appsettings.json.");

    switch (databaseProvider)
    {
        case "Postgres":
            options.UseNpgsql(connectionString);
            break;
        case "SqlServer":
            options.UseSqlServer(connectionString);
            break;
        case "Sqlite":
            options.UseSqlite(connectionString);
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

builder.Services.ConfigureApplicationCookie(options =>
{
    // Browsers scope SameSite by registrable domain, not host/port, so
    // frontend (localhost:3000) and API (localhost:5000) count as the same
    // site locally, and so would e.g. app.numinds.me + api.numinds.me in
    // production. SameSite=Lax + Secure=SameAsRequest (Identity's default)
    // works for that case without requiring HTTPS everywhere. Only switch
    // to SameSite=None + CookieSecurePolicy.Always if the API and frontend
    // ever end up on genuinely different registrable domains.
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;

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

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Skip the HTTPS redirect in Development so the app can run over plain
// HTTP locally (avoids every client needing to trust the ASP.NET Core
// dev certificate). Enforce it everywhere else.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors(CorsPolicyName);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<NumindsDbContext>();
    await db.Database.MigrateAsync();
    await SeedIdentity.RunAsync(scope.ServiceProvider);
}

app.Run();
