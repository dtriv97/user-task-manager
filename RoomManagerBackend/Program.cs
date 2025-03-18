using Microsoft.EntityFrameworkCore;
using RoomManagerBackend.Data;
using RoomManagerBackend.Services;
using RoomManagerBackend.Utilities;

var builder = WebApplication.CreateBuilder(args);

// Builder API Setup
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure JSON serialization to handle circular references
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = System
        .Text
        .Json
        .Serialization
        .ReferenceHandler
        .IgnoreCycles;
});

// Database Setup
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=tasks.db"));

// Add CORS configuration
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddScoped<IUserResidenceService, UserResidenceService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors();
}

app.UseHttpsRedirection();

app.UseStaticFiles(
    new StaticFileOptions
    {
        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
            Path.Combine(Directory.GetCurrentDirectory(), "frontend")
        ),
        RequestPath = "",
    }
);

// Add endpoints
app.AddEndpoints();

// Handle SPA routing
app.MapFallbackToFile("index.html");

app.Run();
