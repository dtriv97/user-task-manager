using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using TaskManager.Data;

namespace TaskManager.Endpoints.Room;

public class DeleteRoom : ICustomEndpoint
{
    public record DeleteRoomRequest
    {
        public required int RoomNumber { get; init; }
    }

    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapPost("deleteRoom", Handle)
            .WithOpenApi(operation =>
            {
                operation.Tags = [new() { Name = "Room" }];
                operation.Summary = "Deletes an existing room";
                operation.Description =
                    "Deletes a room from the system, if it exists otherwise returns a not found error.";
                return operation;
            })
            .Produces<Models.Room>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
    }

    private static async Task<Results<Ok<Models.Room>, NotFound>> Handle(
        AppDbContext dbContext,
        DeleteRoomRequest request
    )
    {
        var roomToDelete = await dbContext.Rooms.FirstOrDefaultAsync(room =>
            room.RoomNumber == request.RoomNumber
        );

        if (roomToDelete == null)
        {
            return TypedResults.NotFound();
        }

        dbContext.Rooms.Remove(roomToDelete);
        await dbContext.SaveChangesAsync();

        return TypedResults.Ok(roomToDelete);
    }
}
