using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Domain.Entities;

public sealed class TechnologyCapability
{
    public long Id { get; set; }
    public required string Code { get; set; }
    public ContentStatus ContentStatus { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<TechnologyTranslation> Translations { get; set; } = [];
}

public sealed class TechnologyTranslation
{
    public long Id { get; set; }
    public long TechnologyCapabilityId { get; set; }
    public required string Locale { get; set; }
    public required string Title { get; set; }
    public string? Summary { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public TechnologyCapability TechnologyCapability { get; set; } = null!;
}
