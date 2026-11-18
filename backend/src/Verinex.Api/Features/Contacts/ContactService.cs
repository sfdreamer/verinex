using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Verinex.Api.Common.Exceptions;
using Verinex.Api.Data;
using Verinex.Api.Domain.Entities;
using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Features.Contacts;

public sealed class ContactRequest
{
    [Required, StringLength(100, MinimumLength = 1)]
    public string Name { get; init; } = string.Empty;

    [Required, StringLength(160, MinimumLength = 1)]
    public string CompanyName { get; init; } = string.Empty;

    [Required, EmailAddress, StringLength(254)]
    public string Email { get; init; } = string.Empty;

    [StringLength(40)]
    public string? Phone { get; init; }

    [StringLength(80)]
    public string? Industry { get; init; }

    [Required, StringLength(80)]
    public string CooperationType { get; init; } = string.Empty;

    [StringLength(80)]
    public string? TargetProduct { get; init; }

    [Required, StringLength(5000, MinimumLength = 1)]
    public string Message { get; init; } = string.Empty;

    [Required, RegularExpression("^(zh-CN|en)$")]
    public string Locale { get; init; } = string.Empty;

    public bool PrivacyConsent { get; init; }

    [Required, StringLength(40)]
    public string PrivacyPolicyVersion { get; init; } = string.Empty;
}

public sealed record ContactResultDto(string Message);

public interface IContactService
{
    Task<ContactResultDto> SubmitAsync(ContactRequest request, CancellationToken cancellationToken);
}

public sealed class ContactService(AppDbContext db, TimeProvider timeProvider) : IContactService
{
    private static readonly HashSet<string> CooperationTypes =
    [
        "data-intelligence", "enterprise-ai", "brand-intelligence", "ai-content", "research-insights"
    ];

    public async Task<ContactResultDto> SubmitAsync(ContactRequest request, CancellationToken cancellationToken)
    {
        var normalized = NormalizeAndValidate(request);
        await ValidateReferencesAsync(normalized, cancellationToken);

        var policyJson = await db.SiteSettings.AsNoTracking()
            .Where(x => x.SettingKey == "privacy_policy_version" && x.Locale == "und")
            .Select(x => x.ValueJson)
            .SingleOrDefaultAsync(cancellationToken);
        var currentPolicy = policyJson is null ? null : JsonSerializer.Deserialize<string>(policyJson);
        if (string.IsNullOrWhiteSpace(currentPolicy) || normalized.PrivacyPolicyVersion != currentPolicy)
            throw ApiValidationException.For("privacyPolicyVersion", "The privacy policy version is no longer current.");

        var now = timeProvider.GetUtcNow().UtcDateTime;
        var duplicateCutoff = now.AddMinutes(-10);
        var isDuplicate = await db.ContactMessages.AsNoTracking().AnyAsync(x =>
            x.Email == normalized.Email && x.CompanyName == normalized.CompanyName && x.Message == normalized.Message && x.CreatedAt >= duplicateCutoff,
            cancellationToken);
        if (isDuplicate) throw new ContactRateLimitException();

        var frequencyCutoff = now.AddHours(-1);
        var recentCount = await db.ContactMessages.AsNoTracking()
            .CountAsync(x => x.Email == normalized.Email && x.CreatedAt >= frequencyCutoff, cancellationToken);
        if (recentCount >= 3) throw new ContactRateLimitException();

        db.ContactMessages.Add(new ContactMessage
        {
            Name = normalized.Name,
            CompanyName = normalized.CompanyName,
            Email = normalized.Email,
            Phone = normalized.Phone,
            IndustryCode = normalized.Industry,
            CooperationType = normalized.CooperationType,
            TargetProductCode = normalized.TargetProduct,
            Message = normalized.Message,
            Locale = normalized.Locale,
            PrivacyConsent = true,
            PrivacyPolicyVersion = currentPolicy,
            Status = ContactStatus.New,
            CreatedAt = now
        });
        await db.SaveChangesAsync(cancellationToken);

        return new ContactResultDto(normalized.Locale == "en"
            ? "Your inquiry has been received. Thank you for contacting VERINEX."
            : "您的咨询已收到，感谢联系 VERINEX。");
    }

    private async Task ValidateReferencesAsync(ContactRequest request, CancellationToken cancellationToken)
    {
        var errors = new Dictionary<string, string[]>();
        if (!string.IsNullOrWhiteSpace(request.Industry) && !await db.Industries.AsNoTracking()
                .AnyAsync(x => x.Code == request.Industry && x.ContentStatus == ContentStatus.Published, cancellationToken))
            errors["industry"] = ["Industry must reference a published industry code."];

        if (!CooperationTypes.Contains(request.CooperationType))
            errors["cooperationType"] = ["Cooperation type is not supported."];

        if (!string.IsNullOrWhiteSpace(request.TargetProduct) && request.TargetProduct != "unsure" &&
            !await db.Products.AsNoTracking().AnyAsync(x => x.Code == request.TargetProduct && x.ContentStatus == ContentStatus.Published, cancellationToken))
            errors["targetProduct"] = ["Target product must reference a published product code or be 'unsure'."];

        if (errors.Count > 0) throw new ApiValidationException(errors);
    }

    private static ContactRequest NormalizeAndValidate(ContactRequest request)
    {
        var normalized = new ContactRequest
        {
            Name = request.Name.Trim(), CompanyName = request.CompanyName.Trim(), Email = request.Email.Trim().ToLowerInvariant(),
            Phone = NullIfWhiteSpace(request.Phone), Industry = NullIfWhiteSpace(request.Industry), CooperationType = request.CooperationType.Trim(),
            TargetProduct = NullIfWhiteSpace(request.TargetProduct), Message = request.Message.Trim(), Locale = request.Locale.Trim(),
            PrivacyConsent = request.PrivacyConsent, PrivacyPolicyVersion = request.PrivacyPolicyVersion.Trim()
        };

        var validationResults = new List<ValidationResult>();
        Validator.TryValidateObject(normalized, new ValidationContext(normalized), validationResults, true);
        var errors = validationResults
            .SelectMany(result => result.MemberNames.DefaultIfEmpty("request").Select(member => (member, result.ErrorMessage ?? "Invalid value.")))
            .GroupBy(x => char.ToLowerInvariant(x.member[0]) + x.member[1..])
            .ToDictionary(group => group.Key, group => group.Select(x => x.Item2).ToArray());
        if (!normalized.PrivacyConsent) errors["privacyConsent"] = ["Privacy consent is required."];
        if (errors.Count > 0) throw new ApiValidationException(errors);
        return normalized;
    }

    private static string? NullIfWhiteSpace(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
