namespace TaskManager.Endpoints;

public interface ICustomEndpoint
{
    public static abstract void Register(IEndpointRouteBuilder app);
}
