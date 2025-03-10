using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data;

namespace TaskManager.Endpoints.Room;

public class CheckInUser : ICustomEndpoint
{
    public record CheckInUserRequest
    {
        public required int RoomNumber { get; init; }
        public required Guid OccupantId { get; init; }
    }

    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapPost("checkInUser", Handle)
            .WithOpenApi(operation =>
            {
                operation.Tags = [new() { Name = "Room" }];
                operation.Summary = "Checks in a user to a room";
                operation.Description =
                    "Adds an occupant to a room, if the room exists otherwise returns a not found error.";
                return operation;
            })
            .Produces<Models.Room>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
    }

    private static async Task<Results<Ok<Models.Room>, NotFound>> Handle(
        AppDbContext dbContext,
        CheckInUserRequest request
    )
    {
        var roomToUpdate = await dbContext.Rooms.FirstOrDefaultAsync(room =>
            room.RoomNumber == request.RoomNumber
        );

        var user = await dbContext.Users.FirstOrDefaultAsync(user =>
            user.UserId == request.OccupantId
        );

        if (user == null || roomToUpdate == null)
        {
            return TypedResults.NotFound();
        }

        // Update room details
        roomToUpdate.Occupants = roomToUpdate.Occupants.Append(user);

        // Update user details
        user.Room = roomToUpdate;
        user.CheckInTime = DateTime.UtcNow;

        await dbContext.SaveChangesAsync();

        return TypedResults.Ok(roomToUpdate);
    }
}
