namespace TaskManager.Utilities;

using Microsoft.AspNetCore.Mvc;
using TaskManager.EndpointServices;

public static class AutoEndpointMapping
{
    public static void AddEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api");

        group.MapPost(
            "addRoom",
            async ([FromBody] AddRoomRequest request, [FromServices] RoomService roomService) =>
                await roomService.AddRoom(request)
        );
    }
}
