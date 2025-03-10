using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data;
using TaskManager.Models;

namespace TaskManager.EndpointServices;

public class GetRoom : ICustomEndpoint
{
    public record GetRoomRequest(int RoomNumber);

    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapPost(
                "getRoom",
                async (GetRoomRequest request, AppDbContext dbContext) =>
                {
                    return await Handle(dbContext, request);
                }
            )
            .WithName("GetRoom")
            .WithOpenApi(operation =>
                new(operation)
                {
                    Summary = "Get a room by its room number",
                    Description =
                        "Retrieves detailed information about a specific room based on the provided room number.",
                }
            )
            .Produces<Room>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
    }

    private static async Task<Results<Ok<Room>, NotFound>> Handle(
        AppDbContext dbContext,
        GetRoomRequest request
    )
    {
        var room = await dbContext.Rooms.FirstOrDefaultAsync(room =>
            room.RoomNumber == request.RoomNumber
        );

        if (room == null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(room);
    }
}
