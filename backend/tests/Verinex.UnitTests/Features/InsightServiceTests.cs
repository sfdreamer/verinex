using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Verinex.Api.Data;
using Verinex.Api.Domain.Entities;
using Verinex.Api.Domain.Enums;
using Verinex.Api.Features.Insights;
using Xunit;

namespace Verinex.UnitTests.Features;

public sealed class InsightServiceTests
{
    [Fact]
    public async Task GetAsync_PrioritizesSameCategoryThenFillsNewest_AndLimitsToThree()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options;
        await using var db = new AppDbContext(options);
        await db.Database.EnsureCreatedAsync();

        db.Articles.AddRange(
            Article("current", "enterprise-ai", 5),
            Article("same-older", "enterprise-ai", 1),
            Article("other-newest", "data-intelligence", 4),
            Article("other-second", "ai-technology", 3),
            Article("other-third", "brand-intelligence", 2));
        await db.SaveChangesAsync();

        var result = await new InsightService(db).GetAsync("current", "en", default);

        Assert.NotNull(result);
        Assert.Equal(["same-older", "other-newest", "other-second"], result.RelatedArticles.Select(x => x.Slug));
    }

    [Fact]
    public async Task ListAsync_DoesNotFallBackWhenTargetLanguageIsMissing()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options;
        await using var db = new AppDbContext(options);
        await db.Database.EnsureCreatedAsync();
        var article = Article("zh-only", "enterprise-ai", 1);
        article.Translations.Single().Locale = "zh-CN";
        db.Articles.Add(article);
        await db.SaveChangesAsync();

        var result = await new InsightService(db).ListAsync("en", null, null, 1, 10, default);

        Assert.Empty(result.Items);
    }

    private static Article Article(string slug, string category, int day) => new()
    {
        CategoryCode = category,
        ContentStatus = ContentStatus.Published,
        PublishedAt = new DateTime(2026, 1, day, 0, 0, 0, DateTimeKind.Utc),
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
        Translations =
        [
            new ArticleTranslation
            {
                Locale = "en", Slug = slug, Title = slug, ContentMarkdown = "sample",
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            }
        ]
    };
}
