using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using RoomManagerBackend.Data;

namespace RoomManagerBackend.Endpoints.Room;

public class CheckOutUser : ICustomEndpoint
{
    public record CheckOutUserRequest
    {
        public required Guid OccupantId { get; init; }
    }

    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapPost("checkOutUser", Handle)
            .WithOpenApi(operation =>
            {
                operation.Tags = [new() { Name = "Room" }];
                operation.Summary = "Check out a user from their room";
                operation.Description =
                    "Checks out a user from their current room, if they are checked into one. Returns not found if user doesn't exist or isn't checked into a room.";
                return operation;
            })
            .Produces<Models.User>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
    }

    private static async Task<Results<Ok<Models.User>, NotFound>> Handle(
        AppDbContext dbContext,
        CheckOutUserRequest request
    )
    {
        var user = await dbContext
            .Users.Include(u => u.Room)
            .FirstOrDefaultAsync(user => user.UserId == request.OccupantId);

        if (user == null || user.Room == null)
        {
            return TypedResults.NotFound();
        }

        // Update user details
        user.Room = null;
        user.CheckOutTime = DateTime.UtcNow;

        await dbContext.SaveChangesAsync();

        return TypedResults.Ok(user);
    }
}
