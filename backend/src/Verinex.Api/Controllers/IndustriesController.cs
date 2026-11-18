using Microsoft.AspNetCore.Mvc;
using Verinex.Api.Common.Results;
using Verinex.Api.Features.Industries;

namespace Verinex.Api.Controllers;

[ApiController]
[Route("api/v1/industries")]
public sealed class IndustriesController(IIndustryService service) : ControllerBase
{
    /// <summary>获取指定语言的已发布行业列表。</summary>
    /// <remarks>lang 支持 zh-CN 与 en，结果按 sortOrder 与 id 排序。</remarks>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<IndustryDto>>>> List(
        [FromQuery] string lang = "zh-CN", CancellationToken cancellationToken = default)
        => Ok(new ApiResponse<IReadOnlyList<IndustryDto>>(await service.ListAsync(lang, cancellationToken)));
}
