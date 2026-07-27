# Numinds.Api

ASP.NET Core Web API backend for the Numinds frontend (`../ai-website-cloner-template-master`).

## Stack

- .NET 9, ASP.NET Core Web API (controllers)
- EF Core, with a runtime-selectable provider: **Postgres**, **SqlServer**, or **Sqlite**
- ASP.NET Core Identity (cookie authentication) for `/api/account/*`
- Swashbuckle (Swagger UI at `/swagger` in Development)

## Running locally

```bash
cd Numinds.Api
dotnet run
```

This uses the `http` launch profile by default → `http://localhost:5000`, matching the
frontend's `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api` default. `appsettings.Development.json`
points `Database:Provider` at **Sqlite** (`numinds.dev.db`, gitignored) so there's nothing to install —
migrations run and the database is seeded automatically on startup.

Plain HTTP is intentional for local dev: `Program.cs` skips `UseHttpsRedirection()` in
Development so you don't need to trust the ASP.NET Core dev certificate. The auth cookie is
configured `SameSite=Lax` / `SecurePolicy=SameAsRequest` (Identity's default) rather than
`SameSite=None`/`Secure=Always`, because browsers scope `SameSite` by registrable domain, not
port — `localhost:3000` and `localhost:5000` count as the same site, and so would e.g.
`app.numinds.me` + `api.numinds.me` in production. **Only switch to `SameSite=None` +
`CookieSecurePolicy.Always` if the frontend and API ever end up on genuinely different
registrable domains** (edit `Program.cs`), and run the `https` launch profile / real HTTPS
in that case.

## Switching database provider

Set `Database:Provider` to `Postgres`, `SqlServer`, or `Sqlite` in `appsettings.json` /
`appsettings.Development.json` / environment variables, and fill in the matching
`ConnectionStrings:<Provider>` entry:

```json
{
  "Database": { "Provider": "Postgres" },
  "ConnectionStrings": {
    "Postgres": "Host=localhost;Port=5432;Database=numinds;Username=numinds;Password=changeme"
  }
}
```

The existing migration (`Migrations/InitialCreate`) was generated against Sqlite/EF Core's
relational model and uses only provider-agnostic column types, so it applies cleanly to
Postgres and SQL Server too — no separate migration needed per provider.

## Seed data

- **Templates** — seeded via EF Core migration `HasData` (`Data/SeedTemplates.cs`): the same
  four wedding templates (`W024` popular, `W031`, `W029`, `W019`) the frontend's
  `TemplatesGrid.tsx` falls back to, with `ImageUrl` pointing at the exact root-relative paths
  already served from the frontend's `public/images/templates/` — so `next/image` renders them
  with no extra image-hosting setup needed.
- **Demo user** — seeded at startup (`Data/SeedIdentity.cs`, since Identity needs `UserManager`
  to hash the password, not migration `HasData`): `demo@numinds.me` / `Passw0rd!23`.

## Endpoints

| Method | Route | Notes |
|---|---|---|
| GET | `/api/templates?category=` | `category` optional |
| GET | `/api/templates/{id}` | |
| GET | `/api/account/me` | 401 if not signed in |
| POST | `/api/account/login` | **Not in the original frontend spec** — added so `/me` and `/logout` are testable before the frontend has a real sign-in screen. `{ email, password }` |
| POST | `/api/account/logout` | Clears the auth cookie |
| DELETE | `/api/account` | Requires auth; deletes the signed-in user |
| POST | `/api/invitations` | `{ templateId? }`, works anonymously; associates with the signed-in user if a session cookie is present |
| GET | `/api/invitations/{id}` | |

DTO shapes mirror `src/types/api.ts` in the frontend exactly (`TemplateDto`, `UserDto`,
`CreateInvitationRequest`, `InvitationDto`); System.Text.Json's default camelCase output
matches those TS interfaces with no extra config.

## CORS

`Program.cs` reads allowed origins from `Cors:AllowedOrigins` (defaults to
`http://localhost:3000`) and applies `AllowAnyHeader()` + `AllowAnyMethod()` +
`AllowCredentials()`. Add production origins there before deploying.

## Migrations

```bash
dotnet ef migrations add <Name> -o Migrations
dotnet ef database update
```

Requires the `dotnet-ef` global tool (`dotnet tool install --global dotnet-ef`).

## Known gaps / follow-ups

- No registration endpoint — only the seeded demo user exists. Add one alongside whatever
  sign-in UI the frontend eventually gets.
- No refresh/expiration story beyond Identity's default cookie lifetime.
- `Invitation`/`Template` are intentionally minimal (no title, event date, guest list, etc.) —
  sized to match exactly what the current frontend's three integration points
  (Templates section, Account Dropdown, Create Invitation action) need today.
