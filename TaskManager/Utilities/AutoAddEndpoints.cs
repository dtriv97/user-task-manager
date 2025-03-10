using TaskManager.Endpoints;
using TaskManager.Endpoints.Room;
using TaskManager.Endpoints.User;

namespace TaskManager.Utilities;

public static class AutoEndpointMapping
{
    public static void AddEndpoints(this IEndpointRouteBuilder app)
    {
        var baseGroup = app.MapGroup("/api");

        baseGroup
            .MapGroup("/room")
            .MapEndpoint<AddRoom>()
            .MapEndpoint<GetRoom>()
            .MapEndpoint<DeleteRoom>()
            .MapEndpoint<CheckInUser>()
            .MapEndpoint<CheckOutUser>()
            .MapEndpoint<GetAllRooms>();

        baseGroup
            .MapGroup("/user")
            .MapEndpoint<AddUser>()
            .MapEndpoint<DeleteUser>()
            .MapEndpoint<GetAllUsers>();
    }

    private static IEndpointRouteBuilder MapEndpoint<TEndpoint>(this IEndpointRouteBuilder app)
        where TEndpoint : ICustomEndpoint
    {
        TEndpoint.Register(app);
        return app;
    }
}
