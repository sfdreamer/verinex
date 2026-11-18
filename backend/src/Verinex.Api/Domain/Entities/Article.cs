using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Domain.Entities;

public sealed class Article
{
    public long Id { get; set; }
    public required string CategoryCode { get; set; }
    public ContentStatus ContentStatus { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime? PublishedAt { get; set; }
    public string? CoverImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<ArticleTranslation> Translations { get; set; } = [];
}

public sealed class ArticleTranslation
{
    public long Id { get; set; }
    public long ArticleId { get; set; }
    public required string Locale { get; set; }
    public required string Slug { get; set; }
    public required string Title { get; set; }
    public string? Excerpt { get; set; }
    public required string ContentMarkdown { get; set; }
    public string? SeoTitle { get; set; }
    public string? SeoDescription { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Article Article { get; set; } = null!;
}
