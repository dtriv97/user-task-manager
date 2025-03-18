using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using RoomManagerBackend.Data;
using RoomManagerBackend.Services;

namespace RoomManagerBackend.Endpoints.Room;

public class CheckInUser : ICustomEndpoint
{
    public record CheckInUserRequest
    {
        public required int RoomNumber { get; init; }
        public required Guid UserId { get; init; }
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

    private static async Task<Results<Ok<Models.Room>, NotFound, BadRequest>> Handle(
        AppDbContext dbContext,
        CheckInUserRequest request,
        IUserResidenceService userResidenceService
    )
    {
        var roomToUpdate = await dbContext
            .Rooms.Include(r => r.Occupants)
            .FirstOrDefaultAsync(room => room.RoomNumber == request.RoomNumber);

        var user = await dbContext
            .Users.Include(u => u.Room)
            .FirstOrDefaultAsync(user => user.UserId == request.UserId);

        if (user == null || roomToUpdate == null)
        {
            return TypedResults.NotFound();
        }

        // Check if room is at max occupancy
        if (roomToUpdate.Occupants.Count >= roomToUpdate.MaxOccupancy)
        {
            return TypedResults.BadRequest();
        }

        // Check if user is already checked into another room
        if (user.Room != null)
        {
            await userResidenceService.EndUserResidenceSession(user.UserId, user.Room.Id);
        }

        await userResidenceService.StartUserResidenceSession(user.UserId, roomToUpdate.Id);

        roomToUpdate.Occupants.Add(user);
        user.Room = roomToUpdate;
        await dbContext.SaveChangesAsync();

        return TypedResults.Ok(roomToUpdate);
    }
}
