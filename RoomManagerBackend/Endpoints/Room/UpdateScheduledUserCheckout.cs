using RoomManagerBackend.Services;

namespace RoomManagerBackend.Endpoints.Room;

public class UpdateScheduledUserCheckout : ICustomEndpoint
{
    public class UpdateScheduledUserCheckoutRequest
    {
        public required Guid UserId { get; init; }
        public required Guid RoomId { get; init; }
        public required DateTime UpdatedCheckout { get; init; }
    }

    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapPost("updateScheduledUserCheckout", Handle)
            .WithOpenApi(operation =>
            {
                operation.Tags = [new() { Name = "Room" }];
                operation.Summary = "Updates a user's scheduled checkout time";
                operation.Description =
                    "Updates a user's scheduled checkout time, if the user is not currently in a room, the request will be ignored.";
                return operation;
            })
            .Produces<Models.User>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    public static async Task<IResult> Handle(
        UpdateScheduledUserCheckoutRequest request,
        IUserResidenceService userResidenceService
    )
    {
        await userResidenceService.UpdateUserResidenceSession(
            request.UserId,
            request.RoomId,
            request.UpdatedCheckout
        );

        return Results.Ok();
    }
}
