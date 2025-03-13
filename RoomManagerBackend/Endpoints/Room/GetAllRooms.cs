using Microsoft.EntityFrameworkCore;
using RoomManagerBackend.Data;

namespace RoomManagerBackend.Endpoints.Room;

public class GetAllRooms : ICustomEndpoint
{
    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapGet("getAllRooms", Handle)
            .WithOpenApi(operation =>
            {
                operation.Tags = [new() { Name = "Room" }];
                operation.Summary = "Gets all rooms";
                operation.Description =
                    "Retrieves all rooms in the system with their current occupants.";
                return operation;
            })
            .Produces<List<Models.Room>>(StatusCodes.Status200OK);
    }

    private static async Task<IResult> Handle(AppDbContext dbContext)
    {
        var rooms = await dbContext.Rooms.Include(r => r.Occupants).ToListAsync();
        return Results.Ok(rooms);
    }
}
