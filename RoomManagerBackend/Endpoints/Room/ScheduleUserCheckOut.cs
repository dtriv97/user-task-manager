using Microsoft.EntityFrameworkCore;
using RoomManagerBackend.Data;

namespace RoomManagerBackend.Endpoints.Room;

public class ScheduleUserCheckout : ICustomEndpoint
{
    public record ScheduleUserCheckoutRequest
    {
        public required Guid UserId { get; set; }
        public required DateTime CheckoutTime { get; set; }
    }

    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapPost("scheduleUserCheckout", Handle)
            .WithOpenApi(operation =>
            {
                operation.Tags = [new() { Name = "Room" }];
                operation.Summary = "Schedules a user's checkout";
                operation.Description =
                    "Schedules a user's checkout to a specific time, if the user is not currently in a room, the request will be ignored.";
                return operation;
            })
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
    }

    public static async Task<IResult> Handle(
        ScheduleUserCheckoutRequest request,
        AppDbContext dbContext
    )
    {
        var userSession = await dbContext.UserResidenceSessions.FirstOrDefaultAsync(us =>
            us.User.UserId == request.UserId
        );

        if (userSession is null)
        {
            return Results.NotFound();
        }

        userSession.ScheduledCheckoutTime = request.CheckoutTime;
        await dbContext.SaveChangesAsync();

        return Results.Ok();
    }
}
