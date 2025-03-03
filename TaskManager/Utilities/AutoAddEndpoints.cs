namespace TaskManager.Utilities;

using System.Reflection;
using TaskManager.Endpoint;

public static class AutoEndpointMapping
{
    public static void AddEndpoints(this WebApplication app)
    {
        var assembly = Assembly.GetExecutingAssembly();
        var endpoints = assembly
            .GetTypes()
            .Where(e =>
                e.IsClass
                && e.Namespace?.Split('.').Last() == "Endpoint"
                && e.GetInterfaces()
                    .Any(i => i.GetGenericTypeDefinition() == typeof(ICustomEndpoint<,>))
            );

        foreach (var endpoint in endpoints)
        {
            var endpointType =
                endpoint.GetCustomAttribute<EndpointAttribute>()
                ?? throw new Exception(
                    $"Endpoint name: {endpoint.Name} found without a valid endpoint type attribute!"
                );

            var baseRoute = "/api/" + endpoint.Name.ToLower();

            var handlerFn = endpoint.GetMethods().First(method => method.Name == "Handle");

            if (handlerFn == null)
            {
                // This shouldn't be possible
                throw new Exception(
                    "The API endpoint class does not implement the required 'Handle' function"
                );
            }

            switch (endpointType.Method)
            {
                case EndpointType.GET:
                case EndpointType.POST:
                case EndpointType.PUT:
                case EndpointType.DELETE:
                    break;
            }
        }
    }
}
