using Microsoft.AspNetCore.Mvc;
using Verinex.Api.Common.Results;
using Verinex.Api.Features.Technology;

namespace Verinex.Api.Controllers;

[ApiController]
[Route("api/v1/technologies")]
public sealed class TechnologiesController(ITechnologyService service) : ControllerBase
{
    /// <summary>获取指定语言的已发布技术能力。</summary>
    /// <remarks>lang 支持 zh-CN 与 en，列表不进行语言回退。</remarks>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<TechnologyDto>>>> List(
        [FromQuery] string lang = "zh-CN", CancellationToken cancellationToken = default)
        => Ok(new ApiResponse<IReadOnlyList<TechnologyDto>>(await service.ListAsync(lang, cancellationToken)));
}
