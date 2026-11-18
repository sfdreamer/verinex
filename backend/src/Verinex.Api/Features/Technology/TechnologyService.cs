using Microsoft.EntityFrameworkCore;
using Verinex.Api.Common.Validation;
using Verinex.Api.Data;
using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Features.Technology;

public sealed record TechnologyDto(long Id, string Code, string Title, string? Summary, string? Description, int SortOrder);

public interface ITechnologyService
{
    Task<IReadOnlyList<TechnologyDto>> ListAsync(string? lang, CancellationToken cancellationToken);
}

public sealed class TechnologyService(AppDbContext db) : ITechnologyService
{
    public async Task<IReadOnlyList<TechnologyDto>> ListAsync(string? lang, CancellationToken cancellationToken)
    {
        var locale = LocaleRules.EnsureSupported(lang);
        return await db.TechnologyTranslations.AsNoTracking()
            .Where(x => x.Locale == locale && x.TechnologyCapability.ContentStatus == ContentStatus.Published)
            .OrderBy(x => x.TechnologyCapability.SortOrder).ThenBy(x => x.TechnologyCapabilityId)
            .Select(x => new TechnologyDto(x.TechnologyCapabilityId, x.TechnologyCapability.Code, x.Title, x.Summary, x.Description, x.TechnologyCapability.SortOrder))
            .ToListAsync(cancellationToken);
    }
}
