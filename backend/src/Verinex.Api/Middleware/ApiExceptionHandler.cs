using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Verinex.Api.Common.Exceptions;

namespace Verinex.Api.Middleware;

public sealed class ApiExceptionHandler(ILogger<ApiExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        ProblemDetails problem;

        if (exception is ApiValidationException validation)
        {
            problem = new ValidationProblemDetails(validation.Errors.ToDictionary(x => x.Key, x => x.Value, StringComparer.OrdinalIgnoreCase))
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "One or more validation errors occurred.",
                Detail = validation.Message,
                Instance = context.Request.Path
            };
        }
        else if (exception is ContactRateLimitException)
        {
            problem = new ProblemDetails
            {
                Status = StatusCodes.Status429TooManyRequests,
                Title = "Too Many Requests",
                Detail = exception.Message,
                Instance = context.Request.Path
            };
        }
        else
        {
            logger.LogError(exception, "Unhandled API error for {Method} {Path}", context.Request.Method, context.Request.Path);
            problem = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "An unexpected error occurred.",
                Detail = "The server could not complete the request.",
                Instance = context.Request.Path
            };
        }

        problem.Extensions["traceId"] = context.TraceIdentifier;
        context.Response.StatusCode = problem.Status ?? StatusCodes.Status500InternalServerError;
        await context.Response.WriteAsJsonAsync(problem, new JsonSerializerOptions(JsonSerializerDefaults.Web), "application/problem+json", cancellationToken);
        return true;
    }
}
