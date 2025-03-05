using TaskManager.Models;

namespace TaskManager.Endpoint;

public record AddRoomRequest
{
    public required int RoomNumber;
    public required int MaxOccupancy;
}

[Endpoint(EndpointType.GET)]
public class AddRoom : ICustomEndpoint<AddRoomRequest, Room>
{
    public async Task<Room> Handle(AddRoomRequest request)
    {
        var room = new Room
        {
            Id = Guid.NewGuid(),
            MaxOccupancy = 2,
            RoomNumber = 122,
        };
        return await Task.FromResult(room);
    }
}
