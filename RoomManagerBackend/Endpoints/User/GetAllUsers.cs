using Microsoft.EntityFrameworkCore;
using RoomManagerBackend.Data;

namespace RoomManagerBackend.Endpoints.User;

public class GetAllUsers : ICustomEndpoint
{
    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapGet("getAllUsers", Handle)
            .WithOpenApi(operation =>
            {
                operation.Tags = [new() { Name = "User" }];
                operation.Summary = "Gets all users";
                operation.Description =
                    "Retrieves all users in the system with their current room assignments.";
                return operation;
            })
            .Produces<List<Models.User>>(StatusCodes.Status200OK);
    }

    private static async Task<IResult> Handle(AppDbContext dbContext)
    {
        var users = await dbContext.Users.Include(u => u.Room).ToListAsync();
        return Results.Ok(users);
    }
}
