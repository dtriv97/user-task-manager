using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data;

namespace TaskManager.Endpoints.Room;

public class GetRoom : ICustomEndpoint
{
    public record GetRoomRequest
    {
        public required int RoomNumber { get; init; }
    }

    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapPost(
                "getRoom",
                async (GetRoomRequest request, AppDbContext dbContext) =>
                {
                    return await Handle(dbContext, request);
                }
            )
            .WithOpenApi(operation =>
            {
                operation.Tags = [new() { Name = "Room" }];
                operation.Summary = "Get a room by its room number";
                operation.Description =
                    "Retrieves detailed information about a specific room based on the provided room number.";
                return operation;
            })
            .Produces<Models.Room>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
    }

    private static async Task<Results<Ok<Models.Room>, NotFound>> Handle(
        AppDbContext dbContext,
        GetRoomRequest request
    )
    {
        var room = await dbContext
            .Rooms.Include(r => r.Occupants)
            .FirstOrDefaultAsync(room => room.RoomNumber == request.RoomNumber);

        if (room == null)
        {
            return TypedResults.NotFound();
        }

        return TypedResults.Ok(room);
    }
}
