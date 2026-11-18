using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;
using Verinex.Api.Data;
using Verinex.Api.Domain.Entities;
using Verinex.Api.Domain.Enums;
using Xunit;

namespace Verinex.IntegrationTests;

public sealed class PublicApiTests : IClassFixture<ApiWebApplicationFactory>
{
    private readonly ApiWebApplicationFactory _factory;

    public PublicApiTests(ApiWebApplicationFactory factory) => _factory = factory;

    [Fact]
    public async Task InvalidFields_ReturnValidationProblemDetailsWith400()
    {
        using var client = _factory.CreateClient();
        using var response = await client.PostAsJsonAsync("/api/v1/contact", Contact(email: "not-an-email"));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal(400, json.RootElement.GetProperty("status").GetInt32());
        Assert.True(json.RootElement.TryGetProperty("errors", out _));
    }

    [Fact]
    public async Task Lists_HideUnpublishedContent_AndDoNotFallBackForMissingLanguage()
    {
        await using (var scope = _factory.Services.CreateAsyncScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Solutions.AddRange(
                Solution("draft-visible-never", ContentStatus.Draft, "en"),
                Solution("zh-only-test", ContentStatus.Published, "zh-CN"));
            await db.SaveChangesAsync();
        }

        using var client = _factory.CreateClient();
        var json = await client.GetStringAsync("/api/v1/solutions?lang=en");
        Assert.DoesNotContain("draft-visible-never", json, StringComparison.Ordinal);
        Assert.DoesNotContain("zh-only-test", json, StringComparison.Ordinal);
    }

    [Fact]
    public async Task RelatedArticles_UseSameCategoryFirst_ThenNewest_AndReturnAtMostThree()
    {
        using var client = _factory.CreateClient();
        using var response = await client.GetAsync("/api/v1/insights/sample-enterprise-ai-readiness?lang=en");
        response.EnsureSuccessStatusCode();
        using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var related = json.RootElement.GetProperty("data").GetProperty("relatedArticles").EnumerateArray().ToArray();

        Assert.Equal(3, related.Length);
        Assert.Equal("sample-human-oversight", related[0].GetProperty("slug").GetString());
        Assert.Equal("sample-governable-knowledge", related[1].GetProperty("slug").GetString());
        Assert.Equal("sample-rag-evaluation", related[2].GetProperty("slug").GetString());
    }

    [Fact]
    public async Task ContactSuccess_IsPersistedAndUsesServerPolicyVersion()
    {
        using var client = _factory.CreateClient();
        using var response = await client.PostAsJsonAsync("/api/v1/contact", Contact(email: "persist@example.com"));
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        await using var scope = _factory.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var saved = Assert.Single(db.ContactMessages.Where(x => x.Email == "persist@example.com"));
        Assert.Equal("1.0", saved.PrivacyPolicyVersion);
        Assert.Equal(ContactStatus.New, saved.Status);
    }

    [Fact]
    public async Task DuplicateContact_IsRateLimited()
    {
        using var client = _factory.CreateClient();
        var payload = Contact(email: "duplicate@example.com");
        using var first = await client.PostAsJsonAsync("/api/v1/contact", payload);
        using var second = await client.PostAsJsonAsync("/api/v1/contact", payload);

        Assert.Equal(HttpStatusCode.Created, first.StatusCode);
        Assert.Equal(HttpStatusCode.TooManyRequests, second.StatusCode);
        Assert.Equal("application/problem+json", second.Content.Headers.ContentType?.MediaType);
        using var problem = JsonDocument.Parse(await second.Content.ReadAsStringAsync());
        Assert.Equal(429, problem.RootElement.GetProperty("status").GetInt32());
    }

    [Fact]
    public async Task FourthRecentContactFromSameEmail_IsRateLimited()
    {
        using var client = _factory.CreateClient();
        for (var i = 1; i <= 3; i++)
        {
            using var accepted = await client.PostAsJsonAsync("/api/v1/contact", Contact(email: "frequent@example.com", message: $"Distinct inquiry {i}"));
            Assert.Equal(HttpStatusCode.Created, accepted.StatusCode);
        }

        using var rejected = await client.PostAsJsonAsync("/api/v1/contact", Contact(email: "frequent@example.com", message: "Distinct inquiry 4"));
        Assert.Equal(HttpStatusCode.TooManyRequests, rejected.StatusCode);
    }

    [Fact]
    public async Task InvalidClientPrivacyVersion_IsRejectedAndNotPersisted()
    {
        using var client = _factory.CreateClient();
        using var response = await client.PostAsJsonAsync("/api/v1/contact", Contact(email: "old-policy@example.com", privacyVersion: "obsolete"));
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        await using var scope = _factory.Services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        Assert.DoesNotContain(db.ContactMessages, x => x.Email == "old-policy@example.com");
    }

    private static object Contact(string email, string message = "We would like to discuss an enterprise AI direction.", string privacyVersion = "1.0") => new
    {
        name = "Alex Zhang", companyName = "Example Technology", email, phone = "+1-555-0100",
        industry = "manufacturing", cooperationType = "enterprise-ai", targetProduct = "verimind",
        message, locale = "en", privacyConsent = true, privacyPolicyVersion = privacyVersion
    };

    private static Solution Solution(string code, ContentStatus status, string locale) => new()
    {
        Code = code, ContentStatus = status, SortOrder = 99, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow,
        Translations =
        [
            new SolutionTranslation
            {
                Locale = locale, Slug = code, Title = code, Summary = code,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
            }
        ]
    };
}
