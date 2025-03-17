using RoomManagerBackend.Endpoints;
using RoomManagerBackend.Endpoints.Room;
using RoomManagerBackend.Endpoints.User;
using RoomManagerBackend.Endpoints.UserResidenceSession;

namespace RoomManagerBackend.Utilities;

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

        baseGroup.MapGroup("/userResidenceSession").MapEndpoint<GetUserResidenceSession>();
    }

    private static IEndpointRouteBuilder MapEndpoint<TEndpoint>(this IEndpointRouteBuilder app)
        where TEndpoint : ICustomEndpoint
    {
        TEndpoint.Register(app);
        return app;
    }
}
