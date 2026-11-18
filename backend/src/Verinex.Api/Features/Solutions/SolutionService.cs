using Microsoft.EntityFrameworkCore;
using Verinex.Api.Common.Validation;
using Verinex.Api.Data;
using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Features.Solutions;

public sealed record SolutionListItemDto(long Id, string Code, string Slug, string Title, string? Subtitle, string Summary, int SortOrder);
public sealed record SolutionDetailDto(long Id, string Code, string Slug, string Title, string? Subtitle, string Summary, string? Body, string? SeoTitle, string? SeoDescription);

public interface ISolutionService
{
    Task<IReadOnlyList<SolutionListItemDto>> ListAsync(string? lang, bool? featured, CancellationToken cancellationToken);
    Task<SolutionDetailDto?> GetAsync(string slug, string? lang, CancellationToken cancellationToken);
}

public sealed class SolutionService(AppDbContext db) : ISolutionService
{
    public async Task<IReadOnlyList<SolutionListItemDto>> ListAsync(string? lang, bool? featured, CancellationToken cancellationToken)
    {
        var locale = LocaleRules.EnsureSupported(lang);
        var query = db.SolutionTranslations.AsNoTracking()
            .Where(x => x.Locale == locale && x.Solution.ContentStatus == ContentStatus.Published);
        if (featured.HasValue) query = query.Where(x => x.Solution.IsFeatured == featured.Value);

        return await query.OrderBy(x => x.Solution.SortOrder).ThenBy(x => x.SolutionId)
            .Select(x => new SolutionListItemDto(x.SolutionId, x.Solution.Code, x.Slug, x.Title, x.Subtitle, x.Summary, x.Solution.SortOrder))
            .ToListAsync(cancellationToken);
    }

    public Task<SolutionDetailDto?> GetAsync(string slug, string? lang, CancellationToken cancellationToken)
    {
        var locale = LocaleRules.EnsureSupported(lang);
        return db.SolutionTranslations.AsNoTracking()
            .Where(x => x.Locale == locale && x.Slug == slug && x.Solution.ContentStatus == ContentStatus.Published)
            .Select(x => new SolutionDetailDto(x.SolutionId, x.Solution.Code, x.Slug, x.Title, x.Subtitle, x.Summary, x.BodyMarkdown, x.SeoTitle, x.SeoDescription))
            .SingleOrDefaultAsync(cancellationToken);
    }
}
