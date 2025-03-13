using Microsoft.EntityFrameworkCore;
using RoomManagerBackend.Data;

namespace RoomManagerBackend.Endpoints.Room;

public class AddRoom : ICustomEndpoint
{
    public record AddRoomRequest
    {
        public required int RoomNumber { get; init; }
        public required int MaxOccupancy { get; init; }
    }

    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapPost("addRoom", Handle)
            .WithOpenApi(operation =>
            {
                operation.Tags = [new() { Name = "Room" }];
                operation.Summary = "Adds a new room";
                operation.Description =
                    "Add a new room to the system, with all its configuration details.";
                return operation;
            })
            .Produces<Models.Room>(StatusCodes.Status200OK);
    }

    private static async Task<IResult> Handle(AppDbContext dbContext, AddRoomRequest request)
    {
        // Check if room number already exists
        var existingRoom = await dbContext.Rooms.FirstOrDefaultAsync(r =>
            r.RoomNumber == request.RoomNumber
        );

        if (existingRoom != null)
        {
            return Results.BadRequest($"Room with number {request.RoomNumber} already exists");
        }

        var room = new Models.Room
        {
            Id = Guid.NewGuid(),
            MaxOccupancy = request.MaxOccupancy,
            RoomNumber = request.RoomNumber,
        };

        dbContext.Rooms.Add(room);
        await dbContext.SaveChangesAsync();

        return Results.Ok(room);
    }
}
