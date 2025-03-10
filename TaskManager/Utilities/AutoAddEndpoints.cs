using TaskManager.EndpointServices;

namespace TaskManager.Utilities;

public static class AutoEndpointMapping
{
    public static void AddEndpoints(this IEndpointRouteBuilder app)
    {
        var baseGroup = app.MapGroup("/api");

        baseGroup.MapGroup("/room").MapEndpoint<AddRoom>().MapEndpoint<GetRoom>();
    }

    private static IEndpointRouteBuilder MapEndpoint<TEndpoint>(this IEndpointRouteBuilder app)
        where TEndpoint : ICustomEndpoint
    {
        TEndpoint.Register(app);
        return app;
    }
}
