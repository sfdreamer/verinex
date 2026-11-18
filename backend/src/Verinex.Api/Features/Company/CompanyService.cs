using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Verinex.Api.Common.Validation;
using Verinex.Api.Data;

namespace Verinex.Api.Features.Company;

public sealed record CompanyDto(
    string BrandName,
    string CompanyName,
    string? Tagline,
    string? Overview,
    string? Mission,
    string? Vision,
    IReadOnlyList<string> Values,
    string? SeoTitle,
    string? SeoDescription);

public interface ICompanyService
{
    Task<CompanyDto?> GetAsync(string? lang, CancellationToken cancellationToken);
}

public sealed class CompanyService(AppDbContext db) : ICompanyService
{
    public async Task<CompanyDto?> GetAsync(string? lang, CancellationToken cancellationToken)
    {
        var locale = LocaleRules.EnsureSupported(lang);
        var item = await db.CompanyProfileTranslations
            .AsNoTracking()
            .Where(x => x.Locale == locale && x.CompanyProfile.IsActive)
            .OrderBy(x => x.CompanyProfileId)
            .Select(x => new
            {
                x.BrandName, x.CompanyName, x.Tagline, x.Overview, x.Mission, x.Vision,
                x.ValuesText, x.SeoTitle, x.SeoDescription
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (item is null) return null;

        var values = string.IsNullOrWhiteSpace(item.ValuesText)
            ? []
            : JsonSerializer.Deserialize<string[]>(item.ValuesText) ?? [];

        return new CompanyDto(item.BrandName, item.CompanyName, item.Tagline, item.Overview, item.Mission,
            item.Vision, values, item.SeoTitle, item.SeoDescription);
    }
}
