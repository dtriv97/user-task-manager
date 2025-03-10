using TaskManager.Data;

namespace TaskManager.Endpoints.Room;

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
