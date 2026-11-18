using System.Net;
using Xunit;

namespace Verinex.IntegrationTests;

/// <summary>
/// /sitemap.xml：只包含已发布内容的 zh / en 地址，并返回 XML。
/// </summary>
public sealed class SitemapTests : IClassFixture<ApiWebApplicationFactory>
{
    private readonly ApiWebApplicationFactory _factory;

    public SitemapTests(ApiWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetSitemap_ReturnsXmlWithPublishedPages()
    {
        using var client = _factory.CreateClient();

        using var response = await client.GetAsync("/sitemap.xml");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("application/xml", response.Content.Headers.ContentType?.MediaType);

        var xml = await response.Content.ReadAsStringAsync();
        Assert.Contains("<urlset", xml);
        Assert.Contains("/zh/about", xml);
        Assert.Contains("/en/about", xml);
        Assert.Contains("/zh/solutions/data-intelligence", xml);
        Assert.Contains("/en/products/verimind", xml);
        Assert.Contains("/zh/insights/", xml);
    }
}
