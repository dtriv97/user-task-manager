using Microsoft.EntityFrameworkCore;
using Npgsql;
using Polly;
using RoomManagerBackend.Data;

namespace RoomManagerBackend.Extensions;

public static class DatabaseExtensions
{
    public static async Task InitializeDatabaseAsync(
        this IServiceProvider serviceProvider,
        ILogger logger,
        IWebHostEnvironment environment
    )
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var retryPolicy = Policy
            .Handle<NpgsqlException>()
            .Or<TimeoutException>()
            .WaitAndRetryAsync(
                3,
                retryAttempt => TimeSpan.FromSeconds(10),
                onRetry: (exception, timeSpan, retryCount, context) =>
                {
                    logger.LogWarning(
                        exception,
                        "Database connection failed. Retry attempt {count}",
                        retryCount
                    );
                }
            );

        await retryPolicy.ExecuteAsync(async () =>
        {
            try
            {
                if (environment.IsDevelopment())
                {
                    await dbContext.Database.EnsureCreatedAsync();
                }
                else
                {
                    logger.LogInformation("Applying database migrations...");
                    await dbContext.Database.MigrateAsync();
                    logger.LogInformation("Database migrations completed successfully");
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error^");
                throw;
            }
        });
    }
}
