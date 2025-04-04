# Build stage for frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY roommagerui/package*.json ./
RUN npm install
COPY roommagerui/ .
RUN npm run build

# Build stage for backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /app/backend
COPY RoomManagerBackend/RoomManagerBackend.csproj RoomManagerBackend/
COPY RoomManagerBackend.sln ./
RUN dotnet restore
COPY RoomManagerBackend/ RoomManagerBackend/
COPY RoomManagerBackend/Migrations/ RoomManagerBackend/Migrations/
RUN dotnet publish -c Release -o /app/publish

# Run migrations in a separate SDK stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS migration
WORKDIR /app
COPY --from=backend-build /app/publish ./
COPY RoomManagerBackend/Migrations/ RoomManagerBackend/Migrations/
RUN dotnet ef database update  # Run migrations here

# Final runtime stage (smaller, no EF tools)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy the published application (migrations already applied)
COPY --from=backend-build /app/publish ./

# Copy frontend build to wwwroot
COPY --from=frontend-build /app/frontend/build ./wwwroot

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port
EXPOSE 8080

# Start the application
ENTRYPOINT ["dotnet", "RoomManagerBackend.dll"]