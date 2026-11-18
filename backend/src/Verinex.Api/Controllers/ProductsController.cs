using Microsoft.AspNetCore.Mvc;
using Verinex.Api.Common.Results;
using Verinex.Api.Features.Products;

namespace Verinex.Api.Controllers;

[ApiController]
[Route("api/v1/products")]
public sealed class ProductsController(IProductService service) : ControllerBase
{
    /// <summary>获取已发布产品内容，可按精选状态和真实成熟度筛选。</summary>
    /// <remarks>stage 支持 PLANNED、IN_DEVELOPMENT 与 RELEASED。</remarks>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProductListItemDto>>>> List(
        [FromQuery] string lang = "zh-CN", [FromQuery] bool? featured = null, [FromQuery] string? stage = null,
        CancellationToken cancellationToken = default)
        => Ok(new ApiResponse<IReadOnlyList<ProductListItemDto>>(await service.ListAsync(lang, featured, stage, cancellationToken)));

    /// <summary>按本地化 slug 获取已发布产品详情。</summary>
    /// <remarks>响应始终包含 productStage 与可为空的 coverImage。</remarks>
    [HttpGet("{slug}")]
    public async Task<IActionResult> Get(string slug, [FromQuery] string lang = "zh-CN", CancellationToken cancellationToken = default)
    {
        var item = await service.GetAsync(slug, lang, cancellationToken);
        return item is null ? Problem(statusCode: StatusCodes.Status404NotFound, title: "Product not found.") : Ok(new ApiResponse<ProductDetailDto>(item));
    }
}
