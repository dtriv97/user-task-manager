using TaskManager.Models;

namespace TaskManager.EndpointServices;

public record AddRoomRequest
{
    public required int RoomNumber { get; init; }
    public required int MaxOccupancy { get; init; }
}

public class RoomService
{
    public async Task<Room> AddRoom(AddRoomRequest request)
    {
        Console.WriteLine(request);
        var room = new Room
        {
            Id = Guid.NewGuid(),
            MaxOccupancy = request.MaxOccupancy,
            RoomNumber = request.RoomNumber,
        };
        return await Task.FromResult(room);
    }
}
