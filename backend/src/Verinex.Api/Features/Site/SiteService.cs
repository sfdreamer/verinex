using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Verinex.Api.Common.Validation;
using Verinex.Api.Data;
using Verinex.Api.Features.Company;
using Verinex.Api.Features.Industries;
using Verinex.Api.Features.Insights;
using Verinex.Api.Features.Products;
using Verinex.Api.Features.Solutions;
using Verinex.Api.Features.Technology;

namespace Verinex.Api.Features.Site;

public sealed record SiteOverviewDto(
    CompanyDto? Company,
    IReadOnlyList<SolutionListItemDto> FeaturedSolutions,
    IReadOnlyList<ProductListItemDto> FeaturedProducts,
    IReadOnlyList<TechnologyDto> TechnologyHighlights,
    IReadOnlyList<IndustryDto> FeaturedIndustries,
    IReadOnlyList<InsightListItemDto> FeaturedInsights);

public sealed record SiteSettingsDto(string? ContactEmail, IReadOnlyList<JsonElement> SocialLinks, string? IcpNumber, string? PrivacyPolicyVersion);

public interface ISiteService
{
    Task<SiteOverviewDto> GetOverviewAsync(string? lang, CancellationToken cancellationToken);
    Task<SiteSettingsDto> GetSettingsAsync(string? lang, CancellationToken cancellationToken);
}

public sealed class SiteService(
    AppDbContext db,
    ICompanyService companyService,
    ISolutionService solutionService,
    IProductService productService,
    ITechnologyService technologyService,
    IIndustryService industryService,
    IInsightService insightService) : ISiteService
{
    public async Task<SiteOverviewDto> GetOverviewAsync(string? lang, CancellationToken cancellationToken)
    {
        var locale = LocaleRules.EnsureSupported(lang);
        var company = await companyService.GetAsync(locale, cancellationToken);
        var solutions = await solutionService.ListAsync(locale, true, cancellationToken);
        var products = await productService.ListAsync(locale, true, null, cancellationToken);
        var technologies = await technologyService.ListAsync(locale, cancellationToken);
        var industries = await industryService.ListAsync(locale, cancellationToken);
        var insights = await insightService.ListAsync(locale, null, true, 1, 3, cancellationToken);

        return new SiteOverviewDto(company, solutions, products, technologies.Take(8).ToList(), industries.Take(5).ToList(), insights.Items);
    }

    public async Task<SiteSettingsDto> GetSettingsAsync(string? lang, CancellationToken cancellationToken)
    {
        var locale = LocaleRules.EnsureSupported(lang);
        var rows = await db.SiteSettings.AsNoTracking()
            .Where(x => x.IsPublic && (x.Locale == "und" || x.Locale == locale))
            .OrderBy(x => x.Locale == locale ? 0 : 1)
            .ToListAsync(cancellationToken);

        string? ReadString(string key)
        {
            var json = rows.FirstOrDefault(x => x.SettingKey == key)?.ValueJson;
            return json is null ? null : JsonSerializer.Deserialize<string>(json);
        }

        var socialJson = rows.FirstOrDefault(x => x.SettingKey == "social_links")?.ValueJson;
        var socialLinks = socialJson is null ? [] : JsonSerializer.Deserialize<JsonElement[]>(socialJson) ?? [];
        return new SiteSettingsDto(ReadString("contact_email"), socialLinks, ReadString("icp_number"), ReadString("privacy_policy_version"));
    }
}
