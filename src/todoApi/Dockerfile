FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 5000

ENV ASPNETCORE_URLS=http://+:5000

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-dotnet-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
# USER appuser
USER root

ENV ASPNETCORE_ENVIRONMENT=Development
ENV JWTValidAudience=http://localhost:4200
ENV JWTSecret=MyREallyLongSecrety
ENV JWTValidIssuer=http://localhost:5000
ENV COSMOS_ENDPOINT=REMOTE_ENDPOINT

ENV CONNECT_TO_LOCAL_ENDPOINT=true
ENV connectionString=AccountEndpoint=LOCAL_ENDPOINT;AccountKey=LOCAL_KEY

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["./todoApi.csproj", "."]
RUN dotnet restore "./todoApi.csproj"
COPY . .
# WORKDIR "."
RUN dotnet build "todoApi.csproj" -c Development -o /app/build

FROM build AS publish
RUN dotnet publish "todoApi.csproj" -c Development -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "todoApi.dll"]
