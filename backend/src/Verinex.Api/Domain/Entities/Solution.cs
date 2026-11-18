using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Domain.Entities;

public sealed class Solution
{
    public long Id { get; set; }
    public required string Code { get; set; }
    public ContentStatus ContentStatus { get; set; }
    public int SortOrder { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<SolutionTranslation> Translations { get; set; } = [];
}

public sealed class SolutionTranslation
{
    public long Id { get; set; }
    public long SolutionId { get; set; }
    public required string Locale { get; set; }
    public required string Slug { get; set; }
    public required string Title { get; set; }
    public string? Subtitle { get; set; }
    public required string Summary { get; set; }
    public string? BodyMarkdown { get; set; }
    public string? SeoTitle { get; set; }
    public string? SeoDescription { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Solution Solution { get; set; } = null!;
}
