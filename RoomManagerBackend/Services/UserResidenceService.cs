using Microsoft.EntityFrameworkCore;
using RoomManagerBackend.Data;
using RoomManagerBackend.Models;

namespace RoomManagerBackend.Services;

public class UserResidenceService(AppDbContext dbContext) : IUserResidenceService
{
    private readonly AppDbContext _dbContext = dbContext;

    public Task<UserResidenceSession> GetUserResidenceSession(Guid userId)
    {
        throw new NotImplementedException();
    }

    public async Task<User> EndUserResidenceSession(Guid userId, Guid roomId)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);

        var currentUserResidenceSession =
            await _dbContext.UserResidenceSessions.FirstOrDefaultAsync(urs =>
                urs.Room.Id == roomId && urs.User.UserId == userId && urs.CheckOutTime == null
            );

        if (currentUserResidenceSession == null || user == null)
        {
            throw new Exception("User not found");
        }

        currentUserResidenceSession.CheckOutTime = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        return user;
    }

    public async Task<Room> StartUserResidenceSession(Guid userId, Guid roomId)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        var room = await _dbContext.Rooms.FindAsync(roomId);

        if (user == null || room == null)
        {
            throw new Exception("User or room not found");
        }

        var userResidenceSession = new UserResidenceSession
        {
            User = user,
            Room = room,
            CheckInTime = DateTime.UtcNow,
        };

        _dbContext.UserResidenceSessions.Add(userResidenceSession);
        await _dbContext.SaveChangesAsync();

        return room;
    }

    public async Task UpdateUserResidenceSession(Guid userId, Guid roomId, DateTime updatedCheckout)
    {
        var user =
            await _dbContext.Users.FindAsync(userId) ?? throw new Exception("User not found");

        var userResidenceSession =
            await _dbContext
                .UserResidenceSessions.Where(urs =>
                    urs.Room.Id == roomId && urs.User.UserId == userId && urs.CheckOutTime == null
                )
                .FirstOrDefaultAsync() ?? throw new Exception("User residence session not found");

        userResidenceSession.CheckOutTime = updatedCheckout;
        await _dbContext.SaveChangesAsync();

        return;
    }
}
