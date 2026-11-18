using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Domain.Entities;

public sealed class Industry
{
    public long Id { get; set; }
    public required string Code { get; set; }
    public ContentStatus ContentStatus { get; set; }
    public int SortOrder { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<IndustryTranslation> Translations { get; set; } = [];
}

public sealed class IndustryTranslation
{
    public long Id { get; set; }
    public long IndustryId { get; set; }
    public required string Locale { get; set; }
    public required string Title { get; set; }
    public string? Summary { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Industry Industry { get; set; } = null!;
}
