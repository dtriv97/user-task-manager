using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using RoomManagerBackend.Data;
using RoomManagerBackend.Services;

namespace RoomManagerBackend.Endpoints.Room;

public class CheckOutUser : ICustomEndpoint
{
    public record CheckOutUserRequest
    {
        public required Guid UserId { get; init; }
        public required Guid RoomId { get; init; }
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
        CheckOutUserRequest request,
        IUserResidenceService userResidenceService
    )
    {
        var user = await userResidenceService.EndUserResidenceSession(
            request.UserId,
            request.RoomId
        );

        if (user == null)
        {
            return TypedResults.NotFound();
        }

        var room = await dbContext.Rooms.FirstOrDefaultAsync(r => r.Id == request.RoomId);

        if (room != null && room.Occupants.Contains(user))
        {
            room.Occupants.Remove(user);
        }

        await dbContext.SaveChangesAsync();

        return TypedResults.Ok(user);
    }
}
