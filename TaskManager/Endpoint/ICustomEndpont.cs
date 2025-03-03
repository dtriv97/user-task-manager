namespace TaskManager.Endpoint;

public interface ICustomEndpoint<TRequest, TResponse>
{
    public Task<TResponse> Handle(TRequest request);
}

public enum EndpointType
{
    GET = 1,
    POST,
    PUT,
    DELETE,
}

[AttributeUsage(AttributeTargets.Class)]
public class EndpointAttribute(EndpointType method) : Attribute
{
    public EndpointType Method { get; } = method;
}
