using Microsoft.EntityFrameworkCore;
using RoomManagerBackend.Models;

namespace RoomManagerBackend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Room> Rooms { get; set; }
    public DbSet<User> Users { get; set; }
}
