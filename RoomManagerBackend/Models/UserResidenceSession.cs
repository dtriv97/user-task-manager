namespace RoomManagerBackend.Models;

public class UserResidenceSession
{
    public int Id { get; set; }
    public required User User { get; set; }
    public required Room Room { get; set; }
    public required DateTime CheckInTime { get; set; }
    public DateTime? CheckOutTime { get; set; }
    public DateTime? ScheduledCheckoutTime { get; set; }
}
