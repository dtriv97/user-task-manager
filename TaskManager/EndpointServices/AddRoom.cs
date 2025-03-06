using TaskManager.Data;
using TaskManager.Models;

namespace TaskManager.EndpointServices;

public record AddRoomRequest
{
    public required int RoomNumber { get; init; }
    public required int MaxOccupancy { get; init; }
}

public class RoomService
{
    private readonly AppDbContext _dbContext;

    public RoomService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Room> AddRoom(AddRoomRequest request)
    {
        var room = new Room
        {
            Id = Guid.NewGuid(),
            MaxOccupancy = request.MaxOccupancy,
            RoomNumber = request.RoomNumber,
        };

        _dbContext.Rooms.Add(room);
        await _dbContext.SaveChangesAsync();

        return room;
    }

    public async Task<Room> GetRoom(Guid id)
    {
        var room = new Room
        {
            Id = id,
            MaxOccupancy = 4,
            RoomNumber = 101,
        };
        return await Task.FromResult(room);
    }
}
