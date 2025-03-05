namespace TaskManager.Utilities;

using System.Diagnostics;
using System.Linq.Expressions;
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
                    .Any(i =>
                        i.IsGenericType
                        && i.GetGenericTypeDefinition() == typeof(ICustomEndpoint<,>)
                    )
            )
            .ToList();

        foreach (var endpoint in endpoints)
        {
            var baseRoute = "/api/" + endpoint.Name.ToLower();

            var handlerFn =
                endpoint.GetMethods().First(method => method.Name == "Handle")
                ?? throw new Exception(
                    "The API endpoint class does not implement the required 'Handle' function"
                );

            var delegateHandler = CreateEndpointHandlerDelegate(endpoint, handlerFn);

            if (delegateHandler != null)
            {
                var endpointRegistered = app.MapMethods(
                    baseRoute,
                    ["GET", "POST", "PUT", "DELETE"],
                    delegateHandler
                );
            }
        }
    }

    private static Delegate CreateEndpointHandlerDelegate(
        Type endpointClassType,
        MethodInfo handlerFn
    )
    {
        return async (HttpContext context) =>
        {
            var parameters = handlerFn
                .GetParameters()
                .Select(p =>
                    p.ParameterType switch
                    {
                        Type t when t == typeof(HttpContext) => context,
                        _ => context.RequestServices.GetService(p.ParameterType),
                    }
                )
                .ToArray();

            var result = handlerFn.Invoke(endpointClassType, parameters);

            if (result is Task taskResult)
            {
                await taskResult.ConfigureAwait(false);
                var resultProperty = taskResult.GetType().GetProperty("Result");
                result = resultProperty?.GetValue(taskResult);
            }

            return result switch
            {
                IResult resultVal => resultVal,
                null => Results.NoContent(),
                _ => Results.Ok(result),
            };
        };
    }
}
