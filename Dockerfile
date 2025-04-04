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
RUN dotnet publish -c Release -o /app/publish

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install dotnet-ef tools (EF Core CLI)
RUN dotnet tool install --global dotnet-ef

# Copy backend files
COPY --from=backend-build /app/publish ./

# Copy frontend build to wwwroot
COPY --from=frontend-build /app/frontend/build ./wwwroot

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port
EXPOSE 8080

# Start the backend application
ENTRYPOINT ["sh", "-c", "dotnet ef database update && exec dotnet RoomManagerBackend.dll"] 
