namespace Verinex.Api.Domain.Entities;

public sealed class CompanyProfile
{
    public long Id { get; set; }
    public required string Code { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<CompanyProfileTranslation> Translations { get; set; } = [];
}

public sealed class CompanyProfileTranslation
{
    public long Id { get; set; }
    public long CompanyProfileId { get; set; }
    public required string Locale { get; set; }
    public required string CompanyName { get; set; }
    public required string BrandName { get; set; }
    public string? Tagline { get; set; }
    public string? Overview { get; set; }
    public string? Mission { get; set; }
    public string? Vision { get; set; }
    public string? ValuesText { get; set; }
    public string? SeoTitle { get; set; }
    public string? SeoDescription { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public CompanyProfile CompanyProfile { get; set; } = null!;
}
