using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Verinex.Api.Data;
using Verinex.Api.Data.Seed;
using Verinex.Api.Domain.Enums;
using Xunit;

namespace Verinex.UnitTests.Data;

public sealed class DatabaseSeederTests
{
    [Fact]
    public async Task SeedAsync_IsIdempotent_AndKeepsAllProductsPlanned()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        var options = new DbContextOptionsBuilder<AppDbContext>().UseSqlite(connection).Options;
        await using var db = new AppDbContext(options);
        await db.Database.EnsureCreatedAsync();

        await DatabaseSeeder.SeedAsync(db);
        var counts = new[] { await db.Solutions.CountAsync(), await db.Products.CountAsync(), await db.Articles.CountAsync(), await db.SiteSettings.CountAsync() };
        await DatabaseSeeder.SeedAsync(db);

        var countsAfterSecondRun = new[] { await db.Solutions.CountAsync(), await db.Products.CountAsync(), await db.Articles.CountAsync(), await db.SiteSettings.CountAsync() };
        Assert.Equal(counts, countsAfterSecondRun);
        Assert.Equal(5, await db.Products.CountAsync());
        Assert.True(await db.Products.AllAsync(x => x.ProductStage == ProductStage.Planned));
        Assert.True(await db.ArticleTranslations.AllAsync(x => x.Title.Contains("示例") || x.Title.Contains("Sample")));
    }
}
