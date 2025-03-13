using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using RoomManagerBackend.Data;

namespace RoomManagerBackend.Endpoints.User;

public class DeleteUser : ICustomEndpoint
{
    public record DeleteUserRequest
    {
        public required Guid UserId { get; init; }
    }

    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapPost("deleteUser", Handle)
            .WithOpenApi(operation =>
            {
                operation.Tags = [new() { Name = "User" }];
                operation.Summary = "Deletes an existing user";
                operation.Description =
                    "Deletes a user from the system, if they exist otherwise returns a not found error.";
                return operation;
            })
            .Produces<Models.User>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
    }

    private static async Task<Results<Ok<Models.User>, NotFound>> Handle(
        AppDbContext dbContext,
        DeleteUserRequest request
    )
    {
        var userToDelete = await dbContext.Users.FirstOrDefaultAsync(user =>
            user.UserId == request.UserId
        );

        if (userToDelete == null)
        {
            return TypedResults.NotFound();
        }

        dbContext.Users.Remove(userToDelete);
        await dbContext.SaveChangesAsync();

        return TypedResults.Ok(userToDelete);
    }
}
