namespace Verinex.Api.Common.Exceptions;

public sealed class ContactRateLimitException : Exception
{
    public ContactRateLimitException()
        : base("Too many contact submissions. Please try again later.")
    {
    }
}
