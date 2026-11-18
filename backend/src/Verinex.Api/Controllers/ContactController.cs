using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Verinex.Api.Common.Results;
using Verinex.Api.Features.Contacts;

namespace Verinex.Api.Controllers;

[ApiController]
[Route("api/v1/contact")]
public sealed class ContactController(IContactService service) : ControllerBase
{
    /// <summary>验证并持久化一条商务联系留言。</summary>
    /// <remarks>服务端校验引用编码与当前隐私政策版本，并限制重复或频繁提交。</remarks>
    [HttpPost]
    [EnableRateLimiting("contact")]
    [Consumes("application/json")]
    [ProducesResponseType<ApiResponse<ContactResultDto>>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status429TooManyRequests)]
    public async Task<IActionResult> Create([FromBody] ContactRequest request, CancellationToken cancellationToken)
    {
        var result = await service.SubmitAsync(request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, new ApiResponse<ContactResultDto>(result));
    }
}
