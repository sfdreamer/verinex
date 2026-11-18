using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Domain.Entities;

public sealed class ContactMessage
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public required string CompanyName { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public string? IndustryCode { get; set; }
    public required string CooperationType { get; set; }
    public string? TargetProductCode { get; set; }
    public required string Message { get; set; }
    public required string Locale { get; set; }
    public bool PrivacyConsent { get; set; }
    public required string PrivacyPolicyVersion { get; set; }
    public ContactStatus Status { get; set; } = ContactStatus.New;
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
}
