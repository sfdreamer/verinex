using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Verinex.Api.Common.Exceptions;
using Verinex.Api.Common.Validation;
using Verinex.Api.Data;
using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Features.Products;

public sealed record ProductListItemDto(long Id, string Code, string Slug, string Name, string? Subtitle, string Summary, string ProductStage, string? CoverImage, int SortOrder);
public sealed record ProductDetailDto(long Id, string Code, string Slug, string Name, string? Subtitle, string Summary, string? Description, IReadOnlyList<string> Features, string ProductStage, string? CoverImage, string? SeoTitle, string? SeoDescription);

public interface IProductService
{
    Task<IReadOnlyList<ProductListItemDto>> ListAsync(string? lang, bool? featured, string? stage, CancellationToken cancellationToken);
    Task<ProductDetailDto?> GetAsync(string slug, string? lang, CancellationToken cancellationToken);
}

public sealed class ProductService(AppDbContext db) : IProductService
{
    public async Task<IReadOnlyList<ProductListItemDto>> ListAsync(string? lang, bool? featured, string? stage, CancellationToken cancellationToken)
    {
        var locale = LocaleRules.EnsureSupported(lang);
        var parsedStage = ParseStage(stage);
        var query = db.ProductTranslations.AsNoTracking()
            .Where(x => x.Locale == locale && x.Product.ContentStatus == ContentStatus.Published);
        if (featured.HasValue) query = query.Where(x => x.Product.IsFeatured == featured.Value);
        if (parsedStage.HasValue) query = query.Where(x => x.Product.ProductStage == parsedStage.Value);

        var items = await query.OrderBy(x => x.Product.SortOrder).ThenBy(x => x.ProductId)
            .Select(x => new { x.ProductId, x.Product.Code, x.Slug, x.Name, x.Subtitle, x.Summary, x.Product.ProductStage, x.Product.CoverImageUrl, x.Product.SortOrder })
            .ToListAsync(cancellationToken);

        return items.Select(x => new ProductListItemDto(x.ProductId, x.Code, x.Slug, x.Name, x.Subtitle, x.Summary,
            FormatStage(x.ProductStage), x.CoverImageUrl, x.SortOrder)).ToList();
    }

    public async Task<ProductDetailDto?> GetAsync(string slug, string? lang, CancellationToken cancellationToken)
    {
        var locale = LocaleRules.EnsureSupported(lang);
        var item = await db.ProductTranslations.AsNoTracking()
            .Where(x => x.Locale == locale && x.Slug == slug && x.Product.ContentStatus == ContentStatus.Published)
            .Select(x => new { x.ProductId, x.Product.Code, x.Slug, x.Name, x.Subtitle, x.Summary, x.Description, x.FeaturesJson, x.Product.ProductStage, x.Product.CoverImageUrl, x.SeoTitle, x.SeoDescription })
            .SingleOrDefaultAsync(cancellationToken);
        if (item is null) return null;

        var features = string.IsNullOrWhiteSpace(item.FeaturesJson) ? [] : JsonSerializer.Deserialize<string[]>(item.FeaturesJson) ?? [];
        return new ProductDetailDto(item.ProductId, item.Code, item.Slug, item.Name, item.Subtitle, item.Summary,
            item.Description, features, FormatStage(item.ProductStage), item.CoverImageUrl, item.SeoTitle, item.SeoDescription);
    }

    private static ProductStage? ParseStage(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        return value switch
        {
            "PLANNED" => ProductStage.Planned,
            "IN_DEVELOPMENT" => ProductStage.InDevelopment,
            "RELEASED" => ProductStage.Released,
            _ => throw ApiValidationException.For("stage", "Stage must be PLANNED, IN_DEVELOPMENT, or RELEASED.")
        };
    }

    internal static string FormatStage(ProductStage stage) => stage switch
    {
        ProductStage.InDevelopment => "IN_DEVELOPMENT",
        ProductStage.Released => "RELEASED",
        _ => "PLANNED"
    };
}
