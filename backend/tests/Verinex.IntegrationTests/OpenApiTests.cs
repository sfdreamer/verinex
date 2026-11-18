using System.Net;
using System.Text.Json;
using Xunit;

namespace Verinex.IntegrationTests;

public sealed class OpenApiTests : IClassFixture<ApiWebApplicationFactory>
{
    private readonly ApiWebApplicationFactory _factory;

    public OpenApiTests(ApiWebApplicationFactory factory) => _factory = factory;

    [Fact]
    public async Task Document_ContainsAllPublicPathsWithGeneratedSummaryAndDescription()
    {
        using var client = _factory.CreateClient();
        using var response = await client.GetAsync("/openapi/v1.json");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var paths = json.RootElement.GetProperty("paths");
        var expected = new[]
        {
            "/api/v1/site/overview", "/api/v1/site/settings", "/api/v1/company", "/api/v1/solutions",
            "/api/v1/solutions/{slug}", "/api/v1/products", "/api/v1/products/{slug}", "/api/v1/technologies",
            "/api/v1/industries", "/api/v1/insights", "/api/v1/insights/{slug}", "/api/v1/contact"
        };
        foreach (var path in expected) Assert.True(paths.TryGetProperty(path, out _), $"Missing OpenAPI path: {path}");

        var operation = paths.GetProperty("/api/v1/contact").GetProperty("post");
        Assert.False(string.IsNullOrWhiteSpace(operation.GetProperty("summary").GetString()));
        Assert.False(string.IsNullOrWhiteSpace(operation.GetProperty("description").GetString()));
    }
}
