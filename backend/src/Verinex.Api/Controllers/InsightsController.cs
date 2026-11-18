using Microsoft.AspNetCore.Mvc;
using Verinex.Api.Common.Results;
using Verinex.Api.Features.Insights;

namespace Verinex.Api.Controllers;

[ApiController]
[Route("api/v1/insights")]
public sealed class InsightsController(IInsightService service) : ControllerBase
{
    /// <summary>分页获取指定语言的已发布文章。</summary>
    /// <remarks>page 从 1 开始，pageSize 范围为 1–50；可按 category 与 featured 过滤。</remarks>
    [HttpGet]
    public async Task<ActionResult<PagedApiResponse<InsightListItemDto>>> List(
        [FromQuery] string lang = "zh-CN", [FromQuery] string? category = null, [FromQuery] bool? featured = null,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken cancellationToken = default)
    {
        var result = await service.ListAsync(lang, category, featured, page, pageSize, cancellationToken);
        return Ok(new PagedApiResponse<InsightListItemDto>(result.Items, result.Meta));
    }

    /// <summary>按本地化 slug 获取文章详情及相关推荐。</summary>
    /// <remarks>相关推荐优先同分类，按发布时间倒序，不足三条时由最新其他文章补齐。</remarks>
    [HttpGet("{slug}")]
    public async Task<IActionResult> Get(string slug, [FromQuery] string lang = "zh-CN", CancellationToken cancellationToken = default)
    {
        var item = await service.GetAsync(slug, lang, cancellationToken);
        return item is null ? Problem(statusCode: StatusCodes.Status404NotFound, title: "Insight not found.") : Ok(new ApiResponse<InsightDetailDto>(item));
    }
}
