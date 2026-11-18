using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Threading.RateLimiting;
using System.Text.Json;
using Verinex.Api.Data;
using Verinex.Api.Data.Seed;
using Verinex.Api.Features.Company;
using Verinex.Api.Features.Contacts;
using Verinex.Api.Features.Industries;
using Verinex.Api.Features.Insights;
using Verinex.Api.Features.Products;
using Verinex.Api.Features.Site;
using Verinex.Api.Features.Sitemap;
using Verinex.Api.Features.Solutions;
using Verinex.Api.Features.Technology;
using Verinex.Api.Infrastructure.Database;
using Verinex.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

// ---------- 服务注册 ----------
builder.Services.AddControllers();
builder.WebHost.ConfigureKestrel(options => options.Limits.MaxRequestBodySize = 1024 * 1024);

// 统一错误响应为 RFC 7807 ProblemDetails（docs/API.md 3.3）。
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();

// OpenAPI 描述随代码生成（docs/API.md 第 11 章）。
builder.Services.AddOpenApi();

// MySQL：Provider 与版本锁定见 docs/ADR-001-mysql-provider.md。
// 连接串通过配置/环境变量注入，仓库内不保存任何真实凭证。
var connectionString = builder.Configuration.GetConnectionString("Default") ?? string.Empty;
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 4, 0))));

builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<ISolutionService, SolutionService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ITechnologyService, TechnologyService>();
builder.Services.AddScoped<IIndustryService, IndustryService>();
builder.Services.AddScoped<IInsightService, InsightService>();
builder.Services.AddScoped<ISiteService, SiteService>();
builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<ISitemapService, SitemapService>();
builder.Services.AddSingleton(TimeProvider.System);

// 开发环境 CORS 只允许明确的本地前端源；生产同源部署由 Nginx 代理，不开放宽泛跨域。
const string devCorsPolicy = "dev-cors";
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
if (allowedOrigins.Length > 0)
{
    builder.Services.AddCors(options =>
        options.AddPolicy(devCorsPolicy, policy =>
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));
}

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, cancellationToken) =>
    {
        var problem = new ProblemDetails
        {
            Status = StatusCodes.Status429TooManyRequests,
            Title = "Too Many Requests",
            Detail = "Too many contact submissions. Please try again later.",
            Instance = context.HttpContext.Request.Path
        };
        problem.Extensions["traceId"] = context.HttpContext.TraceIdentifier;
        await context.HttpContext.Response.WriteAsJsonAsync(problem, new JsonSerializerOptions(JsonSerializerDefaults.Web), "application/problem+json", cancellationToken);
    };
    options.AddPolicy("contact", context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 30,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0,
            AutoReplenishment = true
        }));
});

builder.Services.AddHealthChecks().AddCheck<DatabaseHealthCheck>("database", tags: ["ready"]);

var app = builder.Build();

// ---------- 中间件管线 ----------
// 生产环境 HTTPS 由 Nginx 终止，应用内不重复做 HttpsRedirection，避免反代后的重定向循环。
app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseRateLimiter();

if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Testing"))
{
    app.MapOpenApi();
    if (allowedOrigins.Length > 0)
    {
        app.UseCors(devCorsPolicy);
    }
}

app.MapControllers();

app.MapHealthChecks("/health/live", new() { Predicate = _ => false });
app.MapHealthChecks("/health/ready", new() { Predicate = registration => registration.Tags.Contains("ready") });

// 本地 compose 可显式开启；默认关闭，生产部署不会在每次启动时擅自执行迁移。
if (builder.Configuration.GetValue<bool>("Database:InitializeOnStartup"))
{
    await using var scope = app.Services.CreateAsyncScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await DatabaseSeeder.SeedAsync(db);
}

app.Run();

/// <summary>集成测试（WebApplicationFactory）需要可访问的 Program 类型。</summary>
public partial class Program
{
}
