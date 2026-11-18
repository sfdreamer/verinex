using Microsoft.AspNetCore.Mvc;
using Verinex.Api.Features.Sitemap;

namespace Verinex.Api.Controllers;

/// <summary>站点地图：供搜索引擎抓取已发布的公开页面。</summary>
[ApiController]
public sealed class SitemapController(ISitemapService service, IConfiguration configuration) : ControllerBase
{
    /// <summary>返回 sitemap.xml。</summary>
    /// <remarks>
    /// 地址前缀取自配置 Site:PublicBaseUrl；未配置时使用当前请求的 scheme + host。
    /// 仅包含已发布内容与一级页面，不包含任何未发布或草稿数据。
    /// </remarks>
    [HttpGet("/sitemap.xml")]
    [Produces("application/xml")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var configured = configuration["Site:PublicBaseUrl"];
        var baseUrl = !string.IsNullOrWhiteSpace(configured)
            ? configured
            : $"{Request.Scheme}://{Request.Host}";

        var xml = await service.BuildAsync(baseUrl, cancellationToken);
        return Content(xml, "application/xml; charset=utf-8");
    }
}
