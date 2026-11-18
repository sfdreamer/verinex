using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Domain.Entities;

public sealed class Product
{
    public long Id { get; set; }
    public required string Code { get; set; }
    public ProductStage ProductStage { get; set; }
    public ContentStatus ContentStatus { get; set; }
    public int SortOrder { get; set; }
    public bool IsFeatured { get; set; }
    public string? CoverImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<ProductTranslation> Translations { get; set; } = [];
}

public sealed class ProductTranslation
{
    public long Id { get; set; }
    public long ProductId { get; set; }
    public required string Locale { get; set; }
    public required string Slug { get; set; }
    public required string Name { get; set; }
    public string? Subtitle { get; set; }
    public required string Summary { get; set; }
    public string? Description { get; set; }
    public string? FeaturesJson { get; set; }
    public string? SeoTitle { get; set; }
    public string? SeoDescription { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Product Product { get; set; } = null!;
}
