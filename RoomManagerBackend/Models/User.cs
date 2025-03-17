namespace RoomManagerBackend.Models;

public class User
{
    public required Guid UserId { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public Room? Room { get; set; }
}
