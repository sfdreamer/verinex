using Microsoft.AspNetCore.Mvc;
using Verinex.Api.Common.Results;
using Verinex.Api.Features.Company;

namespace Verinex.Api.Controllers;

[ApiController]
[Route("api/v1/company")]
public sealed class CompanyController(ICompanyService service) : ControllerBase
{
    /// <summary>获取指定语言的企业介绍。</summary>
    /// <remarks>lang 支持 zh-CN 与 en；目标语言不存在时返回 404。</remarks>
    [HttpGet]
    [ProducesResponseType<ApiResponse<CompanyDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get([FromQuery] string lang = "zh-CN", CancellationToken cancellationToken = default)
    {
        var item = await service.GetAsync(lang, cancellationToken);
        return item is null
            ? Problem(statusCode: StatusCodes.Status404NotFound, title: "Company content not found.")
            : Ok(new ApiResponse<CompanyDto>(item));
    }
}
