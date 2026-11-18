using System.Net;
using Xunit;

namespace Verinex.IntegrationTests;

/// <summary>
/// 集成测试基线：确认应用可以启动并对外提供健康检查。
/// 业务接口的集成测试（语言参数、ProblemDetails、未发布内容过滤）在后续阶段补充。
/// </summary>
public sealed class HealthEndpointTests : IClassFixture<ApiWebApplicationFactory>
{
    private readonly ApiWebApplicationFactory _factory;

    public HealthEndpointTests(ApiWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetLive_ReturnsOk()
    {
        using var client = _factory.CreateClient();

        using var response = await client.GetAsync("/health/live");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetReady_ReturnsOkWhenDatabaseIsAvailable()
    {
        using var client = _factory.CreateClient();
        using var response = await client.GetAsync("/health/ready");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
