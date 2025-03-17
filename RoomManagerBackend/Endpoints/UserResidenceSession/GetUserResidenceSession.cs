using Microsoft.EntityFrameworkCore;
using RoomManagerBackend.Data;

namespace RoomManagerBackend.Endpoints.UserResidenceSession;

public class GetUserResidenceSession : ICustomEndpoint
{
    public record GetUserResidenceSessionRequest
    {
        public required Guid UserId { get; init; }
    }

    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapPost("getUserResidenceSession", Handle)
            .WithOpenApi(operation =>
            {
                operation.Tags = [new() { Name = "UserResidenceSession" }];
                operation.Summary = "Get a user's residence session";
                operation.Description = "Get a user's residence session by their user ID.";
                return operation;
            })
            .Produces<Models.UserResidenceSession>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
    }

    private static async Task<IResult> Handle(
        AppDbContext dbContext,
        GetUserResidenceSessionRequest request
    )
    {
        var userResidenceSession = await dbContext
            .UserResidenceSessions.Where(urs => urs.User.UserId == request.UserId)
            .Include(urs => urs.User)
            .FirstOrDefaultAsync();

        if (userResidenceSession == null)
        {
            return Results.NotFound();
        }

        return Results.Ok(userResidenceSession);
    }
}
