using TaskManager.Data;

namespace TaskManager.Endpoints.User;

public class AddUser : ICustomEndpoint
{
    public record AddUserRequest
    {
        public required string FirstName { get; init; }
        public required string LastName { get; init; }
    }

    public static void Register(IEndpointRouteBuilder app)
    {
        app.MapPost("addUser", Handle)
            .WithOpenApi(operation =>
            {
                operation.Tags = [new() { Name = "User" }];
                operation.Summary = "Adds a new user";
                operation.Description =
                    "Add a new user to the system with their basic information.";
                return operation;
            })
            .Produces<Models.User>(StatusCodes.Status200OK);
    }

    private static async Task<IResult> Handle(AppDbContext dbContext, AddUserRequest request)
    {
        var user = new Models.User
        {
            UserId = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        return Results.Ok(user);
    }
}
