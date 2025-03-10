using TaskManager.Data;
using TaskManager.EndpointServices;
using TaskManager.Models;

namespace TaskManager.Endpoints.Room;

public record AddRoomRequest
{
    public required int RoomNumber { get; init; }
    public required int MaxOccupancy { get; init; }
}

public class AddRoom : ICustomEndpoint
{
    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapPost("addRoom", Handle)
            .WithName("AddRoom")
            .WithOpenApi(operation =>
                new(operation)
                {
                    Summary = "Adds a new room",
                    Description =
                        "Add a new room to the system, with all its configuration details.",
                }
            )
            .Produces<Room>(StatusCodes.Status200OK)
    }

    private static async Task<IResult> Handle(AppDbContext dbContext, AddRoomRequest request)
    {
        var room = new Room
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
