FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY Numinds.Api.csproj .
RUN dotnet restore Numinds.Api.csproj

COPY . .
RUN dotnet publish Numinds.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Numinds.Api.dll"]
