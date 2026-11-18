namespace Verinex.Api.Common.Results;

public sealed record ApiResponse<T>(T Data);

public sealed record PagedApiResponse<T>(IReadOnlyList<T> Data, PageMeta Meta);

public sealed record PageMeta(int Page, int PageSize, int TotalCount, int TotalPages);
