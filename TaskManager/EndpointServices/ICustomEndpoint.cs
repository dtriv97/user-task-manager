namespace TaskManager.EndpointServices;

public interface ICustomEndpoint
{
    public static abstract void Register(IEndpointRouteBuilder app);
}
