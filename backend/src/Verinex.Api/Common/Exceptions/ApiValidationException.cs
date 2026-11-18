namespace Verinex.Api.Common.Exceptions;

public sealed class ApiValidationException : Exception
{
    public ApiValidationException(IDictionary<string, string[]> errors)
        : base("The request contains invalid fields.")
    {
        Errors = new Dictionary<string, string[]>(errors, StringComparer.OrdinalIgnoreCase);
    }

    public IReadOnlyDictionary<string, string[]> Errors { get; }

    public static ApiValidationException For(string field, string error) =>
        new(new Dictionary<string, string[]> { [field] = [error] });
}
