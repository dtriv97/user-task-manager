using RoomManagerBackend.Models;

namespace RoomManagerBackend.Services;

public interface IUserResidenceService
{
    Task<UserResidenceSession> GetUserResidenceSession(Guid userId);
    Task<User> EndUserResidenceSession(Guid userId, Guid roomId);
    Task<Room> StartUserResidenceSession(Guid userId, Guid roomId);
}
