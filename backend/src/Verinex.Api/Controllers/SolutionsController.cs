using Microsoft.AspNetCore.Mvc;
using Verinex.Api.Common.Results;
using Verinex.Api.Features.Solutions;

namespace Verinex.Api.Controllers;

[ApiController]
[Route("api/v1/solutions")]
public sealed class SolutionsController(ISolutionService service) : ControllerBase
{
    /// <summary>获取指定语言的已发布解决方案列表。</summary>
    /// <remarks>可使用 featured 过滤精选内容，按 sortOrder 与 id 稳定排序。</remarks>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<SolutionListItemDto>>>> List(
        [FromQuery] string lang = "zh-CN", [FromQuery] bool? featured = null, CancellationToken cancellationToken = default)
        => Ok(new ApiResponse<IReadOnlyList<SolutionListItemDto>>(await service.ListAsync(lang, featured, cancellationToken)));

    /// <summary>按本地化 slug 获取已发布解决方案详情。</summary>
    /// <remarks>lang 支持 zh-CN 与 en，不进行跨语言正文回退。</remarks>
    [HttpGet("{slug}")]
    public async Task<IActionResult> Get(string slug, [FromQuery] string lang = "zh-CN", CancellationToken cancellationToken = default)
    {
        var item = await service.GetAsync(slug, lang, cancellationToken);
        return item is null ? Problem(statusCode: StatusCodes.Status404NotFound, title: "Solution not found.") : Ok(new ApiResponse<SolutionDetailDto>(item));
    }
}
