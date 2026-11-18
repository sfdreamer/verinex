namespace Verinex.Api.Domain.Entities;

public sealed class SiteSetting
{
    public long Id { get; set; }
    public required string SettingKey { get; set; }
    public required string Locale { get; set; }
    public required string ValueJson { get; set; }
    public bool IsPublic { get; set; }
    public DateTime UpdatedAt { get; set; }
}
