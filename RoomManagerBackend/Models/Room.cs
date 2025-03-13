namespace RoomManagerBackend.Models;

public class Room
{
    public required Guid Id { get; init; }
    public required int RoomNumber { get; init; }
    public ICollection<User> Occupants { get; set; } = new List<User>();
    public required int MaxOccupancy { get; init; }
}
