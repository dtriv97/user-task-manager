using Microsoft.AspNetCore.Http.HttpResults;
using TaskManager.Data;
using TaskManager.Models;

namespace TaskManager.EndpointServices;

public record AddRoomRequest
{
    public required int RoomNumber { get; init; }
    public required int MaxOccupancy { get; init; }
}

public class AddRoom : ICustomEndpoint
{
    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapPost("addRoom", Handle).Produces<Room>(StatusCodes.Status201Created);
    }

    private static async Task<Room> Handle(AppDbContext dbContext, AddRoomRequest request)
    {
        var room = new Room
        {
            Id = Guid.NewGuid(),
            MaxOccupancy = request.MaxOccupancy,
            RoomNumber = request.RoomNumber,
        };

        dbContext.Rooms.Add(room);
        await dbContext.SaveChangesAsync();

        return room;
    }
}
