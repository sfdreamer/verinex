using Microsoft.EntityFrameworkCore;
using Verinex.Api.Common.Validation;
using Verinex.Api.Data;
using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Features.Industries;

public sealed record IndustryDto(long Id, string Code, string Title, string? Summary, string? Description, int SortOrder);

public interface IIndustryService
{
    Task<IReadOnlyList<IndustryDto>> ListAsync(string? lang, CancellationToken cancellationToken);
}

public sealed class IndustryService(AppDbContext db) : IIndustryService
{
    public async Task<IReadOnlyList<IndustryDto>> ListAsync(string? lang, CancellationToken cancellationToken)
    {
        var locale = LocaleRules.EnsureSupported(lang);
        return await db.IndustryTranslations.AsNoTracking()
            .Where(x => x.Locale == locale && x.Industry.ContentStatus == ContentStatus.Published)
            .OrderBy(x => x.Industry.SortOrder).ThenBy(x => x.IndustryId)
            .Select(x => new IndustryDto(x.IndustryId, x.Industry.Code, x.Title, x.Summary, x.Description, x.Industry.SortOrder))
            .ToListAsync(cancellationToken);
    }
}
