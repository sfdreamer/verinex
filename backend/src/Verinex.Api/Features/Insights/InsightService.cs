using Microsoft.EntityFrameworkCore;
using Verinex.Api.Common.Exceptions;
using Verinex.Api.Common.Results;
using Verinex.Api.Common.Validation;
using Verinex.Api.Data;
using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Features.Insights;

public sealed record InsightListItemDto(long Id, string Slug, string Title, string? Excerpt, string CategoryCode, string? CoverImage, DateTime? PublishedAt, bool IsFeatured);
public sealed record RelatedArticleDto(string Slug, string Title, string? Excerpt, string? CoverImage, DateTime? PublishedAt);
public sealed record InsightDetailDto(long Id, string Slug, string Title, string? Excerpt, string CategoryCode, string Content, string? CoverImage, DateTime? PublishedAt, string? SeoTitle, string? SeoDescription, IReadOnlyList<RelatedArticleDto> RelatedArticles);
public sealed record InsightPage(IReadOnlyList<InsightListItemDto> Items, PageMeta Meta);

public interface IInsightService
{
    Task<InsightPage> ListAsync(string? lang, string? category, bool? featured, int page, int pageSize, CancellationToken cancellationToken);
    Task<InsightDetailDto?> GetAsync(string slug, string? lang, CancellationToken cancellationToken);
}

public sealed class InsightService(AppDbContext db) : IInsightService
{
    public async Task<InsightPage> ListAsync(string? lang, string? category, bool? featured, int page, int pageSize, CancellationToken cancellationToken)
    {
        var locale = LocaleRules.EnsureSupported(lang);
        var errors = new Dictionary<string, string[]>();
        if (page < 1) errors["page"] = ["Page must be at least 1."];
        if (pageSize is < 1 or > 50) errors["pageSize"] = ["Page size must be between 1 and 50."];
        if (category?.Length > 80) errors["category"] = ["Category must not exceed 80 characters."];
        if (errors.Count > 0) throw new ApiValidationException(errors);

        var query = db.ArticleTranslations.AsNoTracking()
            .Where(x => x.Locale == locale && x.Article.ContentStatus == ContentStatus.Published && x.Article.PublishedAt != null);
        if (!string.IsNullOrWhiteSpace(category)) query = query.Where(x => x.Article.CategoryCode == category);
        if (featured.HasValue) query = query.Where(x => x.Article.IsFeatured == featured.Value);

        var total = await query.CountAsync(cancellationToken);
        var items = await query.OrderByDescending(x => x.Article.PublishedAt).ThenByDescending(x => x.ArticleId)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(x => new InsightListItemDto(x.ArticleId, x.Slug, x.Title, x.Excerpt, x.Article.CategoryCode, x.Article.CoverImageUrl, x.Article.PublishedAt, x.Article.IsFeatured))
            .ToListAsync(cancellationToken);

        return new InsightPage(items, new PageMeta(page, pageSize, total, (int)Math.Ceiling(total / (double)pageSize)));
    }

    public async Task<InsightDetailDto?> GetAsync(string slug, string? lang, CancellationToken cancellationToken)
    {
        var locale = LocaleRules.EnsureSupported(lang);
        var current = await db.ArticleTranslations.AsNoTracking()
            .Where(x => x.Locale == locale && x.Slug == slug && x.Article.ContentStatus == ContentStatus.Published && x.Article.PublishedAt != null)
            .Select(x => new
            {
                x.ArticleId, x.Slug, x.Title, x.Excerpt, x.Article.CategoryCode, x.ContentMarkdown,
                x.Article.CoverImageUrl, x.Article.PublishedAt, x.SeoTitle, x.SeoDescription
            })
            .SingleOrDefaultAsync(cancellationToken);
        if (current is null) return null;

        var candidates = await db.ArticleTranslations.AsNoTracking()
            .Where(x => x.Locale == locale && x.ArticleId != current.ArticleId && x.Article.ContentStatus == ContentStatus.Published && x.Article.PublishedAt != null)
            .OrderByDescending(x => x.Article.PublishedAt).ThenByDescending(x => x.ArticleId)
            .Select(x => new
            {
                x.ArticleId, x.Slug, x.Title, x.Excerpt, x.Article.CategoryCode,
                x.Article.CoverImageUrl, x.Article.PublishedAt
            })
            .ToListAsync(cancellationToken);

        var selected = candidates.Where(x => x.CategoryCode == current.CategoryCode).Take(3).ToList();
        if (selected.Count < 3)
        {
            var selectedIds = selected.Select(x => x.ArticleId).ToHashSet();
            selected.AddRange(candidates.Where(x => !selectedIds.Contains(x.ArticleId)).Take(3 - selected.Count));
        }

        var related = selected.Select(x => new RelatedArticleDto(x.Slug, x.Title, x.Excerpt, x.CoverImageUrl, x.PublishedAt)).ToList();
        return new InsightDetailDto(current.ArticleId, current.Slug, current.Title, current.Excerpt, current.CategoryCode,
            current.ContentMarkdown, current.CoverImageUrl, current.PublishedAt, current.SeoTitle, current.SeoDescription, related);
    }
}
