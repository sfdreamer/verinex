using Microsoft.EntityFrameworkCore;
using Verinex.Api.Data;
using Xunit;

namespace Verinex.UnitTests.Data;

public sealed class AppDbContextModelTests
{
    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseMySql(
                "Server=localhost;Database=verinex;User Id=verinex;Password=dev-only-not-a-secret;",
                new MySqlServerVersion(new Version(8, 4, 0)))
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public void Model_ContainsOnlyTheFourteenMvpEntities()
    {
        using var context = CreateContext();

        var entities = context.Model.GetEntityTypes().ToList();
        Assert.Equal(14, entities.Count);
        Assert.DoesNotContain(entities, x => x.ClrType.Name.Contains("MediaAsset", StringComparison.Ordinal));
        Assert.Contains(entities, x => x.GetTableName() == "contact_messages");
        Assert.Contains(entities, x => x.GetTableName() == "site_settings");
    }

    [Fact]
    public void Model_UsesMySqlProvider()
    {
        using var context = CreateContext();

        Assert.NotNull(context.Database.ProviderName);
        Assert.Contains("MySql", context.Database.ProviderName, StringComparison.OrdinalIgnoreCase);
    }
}
