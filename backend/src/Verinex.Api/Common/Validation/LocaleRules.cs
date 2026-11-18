using Verinex.Api.Common.Exceptions;

namespace Verinex.Api.Common.Validation;

public static class LocaleRules
{
    public const string Default = "zh-CN";

    public static string EnsureSupported(string? locale)
    {
        var value = string.IsNullOrWhiteSpace(locale) ? Default : locale;
        if (value is "zh-CN" or "en") return value;

        throw ApiValidationException.For("lang", "Language must be either 'zh-CN' or 'en'.");
    }
}
