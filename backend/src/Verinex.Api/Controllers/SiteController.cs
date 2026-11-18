using Microsoft.AspNetCore.Mvc;
using Verinex.Api.Common.Results;
using Verinex.Api.Features.Site;

namespace Verinex.Api.Controllers;

[ApiController]
[Route("api/v1/site")]
public sealed class SiteController(ISiteService service) : ControllerBase
{
    /// <summary>获取首页指定语言的聚合内容。</summary>
    /// <remarks>聚合数据仅包含已发布且存在目标语言翻译的内容。</remarks>
    [HttpGet("overview")]
    public async Task<ActionResult<ApiResponse<SiteOverviewDto>>> Overview(
        [FromQuery] string lang = "zh-CN", CancellationToken cancellationToken = default)
        => Ok(new ApiResponse<SiteOverviewDto>(await service.GetOverviewAsync(lang, cancellationToken)));

    /// <summary>获取联系邮箱、社交链接、备案号和当前隐私政策版本等公开配置。</summary>
    /// <remarks>仅返回 is_public 为 true 的白名单字段。</remarks>
    [HttpGet("settings")]
    public async Task<ActionResult<ApiResponse<SiteSettingsDto>>> Settings(
        [FromQuery] string lang = "zh-CN", CancellationToken cancellationToken = default)
        => Ok(new ApiResponse<SiteSettingsDto>(await service.GetSettingsAsync(lang, cancellationToken)));
}
