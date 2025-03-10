namespace TaskManager.Models;

public class Room
{
    public required Guid Id { get; init; }
    public required int RoomNumber { get; init; }
    public IEnumerable<User> Occupants { get; set; } = [];
    public required int MaxOccupancy { get; init; }
}
