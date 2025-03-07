using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.Utilities;

var builder = WebApplication.CreateBuilder(args);

// Builder API Setup
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database Setup
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=tasks.db"));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();

app.AddEndpoints();

app.Run();
