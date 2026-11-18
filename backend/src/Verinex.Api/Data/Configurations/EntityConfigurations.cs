using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Verinex.Api.Domain.Entities;
using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Data.Configurations;

internal static class Mapping
{
    internal static readonly ValueConverter<ContentStatus, string> ContentStatusConverter = new(
        value => value == ContentStatus.Published ? "PUBLISHED" : value == ContentStatus.Archived ? "ARCHIVED" : "DRAFT",
        value => value == "PUBLISHED" ? ContentStatus.Published : value == "ARCHIVED" ? ContentStatus.Archived : ContentStatus.Draft);

    internal static readonly ValueConverter<ProductStage, string> ProductStageConverter = new(
        value => value == ProductStage.InDevelopment ? "IN_DEVELOPMENT" : value == ProductStage.Released ? "RELEASED" : "PLANNED",
        value => value == "IN_DEVELOPMENT" ? ProductStage.InDevelopment : value == "RELEASED" ? ProductStage.Released : ProductStage.Planned);

    internal static readonly ValueConverter<ContactStatus, string> ContactStatusConverter = new(
        value => value == ContactStatus.Processing ? "PROCESSING" : value == ContactStatus.Replied ? "REPLIED" : value == ContactStatus.Closed ? "CLOSED" : "NEW",
        value => value == "PROCESSING" ? ContactStatus.Processing : value == "REPLIED" ? ContactStatus.Replied : value == "CLOSED" ? ContactStatus.Closed : ContactStatus.New);

    internal static void Id<TEntity>(EntityTypeBuilder<TEntity> builder) where TEntity : class
    {
        builder.Property<long>("Id").HasColumnName("id").ValueGeneratedOnAdd();
        builder.HasKey("Id");
    }

    internal static void Audit<TEntity>(EntityTypeBuilder<TEntity> builder) where TEntity : class
    {
        builder.Property<DateTime>("CreatedAt").HasColumnName("created_at").HasColumnType("datetime(3)").IsRequired();
        builder.Property<DateTime>("UpdatedAt").HasColumnName("updated_at").HasColumnType("datetime(3)").IsRequired();
    }
}

public sealed class CompanyProfileConfiguration : IEntityTypeConfiguration<CompanyProfile>
{
    public void Configure(EntityTypeBuilder<CompanyProfile> builder)
    {
        builder.ToTable("company_profiles");
        Mapping.Id(builder);
        builder.Property(x => x.Code).HasColumnName("code").HasMaxLength(50).IsRequired();
        builder.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true).IsRequired();
        Mapping.Audit(builder);
        builder.HasIndex(x => x.Code).IsUnique();
        builder.HasMany(x => x.Translations).WithOne(x => x.CompanyProfile).HasForeignKey(x => x.CompanyProfileId).OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class CompanyProfileTranslationConfiguration : IEntityTypeConfiguration<CompanyProfileTranslation>
{
    public void Configure(EntityTypeBuilder<CompanyProfileTranslation> builder)
    {
        builder.ToTable("company_profile_translations", table => table.HasCheckConstraint("ck_company_profile_translations_locale", "`locale` in ('zh-CN','en')"));
        Mapping.Id(builder);
        builder.Property(x => x.CompanyProfileId).HasColumnName("company_profile_id");
        builder.Property(x => x.Locale).HasColumnName("locale").HasMaxLength(10).IsRequired();
        builder.Property(x => x.CompanyName).HasColumnName("company_name").HasMaxLength(160).IsRequired();
        builder.Property(x => x.BrandName).HasColumnName("brand_name").HasMaxLength(100).IsRequired();
        builder.Property(x => x.Tagline).HasColumnName("tagline").HasMaxLength(255);
        builder.Property(x => x.Overview).HasColumnName("overview").HasColumnType("text");
        builder.Property(x => x.Mission).HasColumnName("mission").HasColumnType("text");
        builder.Property(x => x.Vision).HasColumnName("vision").HasColumnType("text");
        builder.Property(x => x.ValuesText).HasColumnName("values_text").HasColumnType("text");
        builder.Property(x => x.SeoTitle).HasColumnName("seo_title").HasMaxLength(255);
        builder.Property(x => x.SeoDescription).HasColumnName("seo_description").HasMaxLength(500);
        Mapping.Audit(builder);
        builder.HasIndex(x => new { x.CompanyProfileId, x.Locale }).IsUnique();
    }
}

public sealed class SolutionConfiguration : IEntityTypeConfiguration<Solution>
{
    public void Configure(EntityTypeBuilder<Solution> builder)
    {
        builder.ToTable("solutions", table => table.HasCheckConstraint("ck_solutions_content_status", "`content_status` in ('DRAFT','PUBLISHED','ARCHIVED')"));
        Mapping.Id(builder);
        builder.Property(x => x.Code).HasColumnName("code").HasMaxLength(80).IsRequired();
        builder.Property(x => x.ContentStatus).HasColumnName("content_status").HasMaxLength(20).HasConversion(Mapping.ContentStatusConverter).IsRequired();
        builder.Property(x => x.SortOrder).HasColumnName("sort_order").HasDefaultValue(0).IsRequired();
        builder.Property(x => x.IsFeatured).HasColumnName("is_featured").HasDefaultValue(false).IsRequired();
        Mapping.Audit(builder);
        builder.HasIndex(x => x.Code).IsUnique();
        builder.HasIndex(x => new { x.ContentStatus, x.SortOrder });
        builder.HasMany(x => x.Translations).WithOne(x => x.Solution).HasForeignKey(x => x.SolutionId).OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class SolutionTranslationConfiguration : IEntityTypeConfiguration<SolutionTranslation>
{
    public void Configure(EntityTypeBuilder<SolutionTranslation> builder)
    {
        builder.ToTable("solution_translations", table => table.HasCheckConstraint("ck_solution_translations_locale", "`locale` in ('zh-CN','en')"));
        Mapping.Id(builder);
        builder.Property(x => x.SolutionId).HasColumnName("solution_id");
        builder.Property(x => x.Locale).HasColumnName("locale").HasMaxLength(10).IsRequired();
        builder.Property(x => x.Slug).HasColumnName("slug").HasMaxLength(180).IsRequired();
        builder.Property(x => x.Title).HasColumnName("title").HasMaxLength(180).IsRequired();
        builder.Property(x => x.Subtitle).HasColumnName("subtitle").HasMaxLength(255);
        builder.Property(x => x.Summary).HasColumnName("summary").HasMaxLength(600).IsRequired();
        builder.Property(x => x.BodyMarkdown).HasColumnName("body_markdown").HasColumnType("longtext");
        builder.Property(x => x.SeoTitle).HasColumnName("seo_title").HasMaxLength(255);
        builder.Property(x => x.SeoDescription).HasColumnName("seo_description").HasMaxLength(500);
        Mapping.Audit(builder);
        builder.HasIndex(x => new { x.SolutionId, x.Locale }).IsUnique();
        builder.HasIndex(x => new { x.Locale, x.Slug }).IsUnique();
        builder.HasIndex(x => x.Slug);
    }
}

public sealed class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("products", table =>
        {
            table.HasCheckConstraint("ck_products_content_status", "`content_status` in ('DRAFT','PUBLISHED','ARCHIVED')");
            table.HasCheckConstraint("ck_products_product_stage", "`product_stage` in ('PLANNED','IN_DEVELOPMENT','RELEASED')");
        });
        Mapping.Id(builder);
        builder.Property(x => x.Code).HasColumnName("code").HasMaxLength(80).IsRequired();
        builder.Property(x => x.ProductStage).HasColumnName("product_stage").HasMaxLength(24).HasConversion(Mapping.ProductStageConverter).IsRequired();
        builder.Property(x => x.ContentStatus).HasColumnName("content_status").HasMaxLength(20).HasConversion(Mapping.ContentStatusConverter).IsRequired();
        builder.Property(x => x.SortOrder).HasColumnName("sort_order").HasDefaultValue(0).IsRequired();
        builder.Property(x => x.IsFeatured).HasColumnName("is_featured").HasDefaultValue(false).IsRequired();
        builder.Property(x => x.CoverImageUrl).HasColumnName("cover_image_url").HasMaxLength(1000);
        Mapping.Audit(builder);
        builder.HasIndex(x => x.Code).IsUnique();
        builder.HasIndex(x => new { x.ContentStatus, x.SortOrder });
        builder.HasMany(x => x.Translations).WithOne(x => x.Product).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class ProductTranslationConfiguration : IEntityTypeConfiguration<ProductTranslation>
{
    public void Configure(EntityTypeBuilder<ProductTranslation> builder)
    {
        builder.ToTable("product_translations", table => table.HasCheckConstraint("ck_product_translations_locale", "`locale` in ('zh-CN','en')"));
        Mapping.Id(builder);
        builder.Property(x => x.ProductId).HasColumnName("product_id");
        builder.Property(x => x.Locale).HasColumnName("locale").HasMaxLength(10).IsRequired();
        builder.Property(x => x.Slug).HasColumnName("slug").HasMaxLength(180).IsRequired();
        builder.Property(x => x.Name).HasColumnName("name").HasMaxLength(180).IsRequired();
        builder.Property(x => x.Subtitle).HasColumnName("subtitle").HasMaxLength(255);
        builder.Property(x => x.Summary).HasColumnName("summary").HasMaxLength(600).IsRequired();
        builder.Property(x => x.Description).HasColumnName("description").HasColumnType("longtext");
        builder.Property(x => x.FeaturesJson).HasColumnName("features_json").HasColumnType("json");
        builder.Property(x => x.SeoTitle).HasColumnName("seo_title").HasMaxLength(255);
        builder.Property(x => x.SeoDescription).HasColumnName("seo_description").HasMaxLength(500);
        Mapping.Audit(builder);
        builder.HasIndex(x => new { x.ProductId, x.Locale }).IsUnique();
        builder.HasIndex(x => new { x.Locale, x.Slug }).IsUnique();
    }
}

public sealed class TechnologyCapabilityConfiguration : IEntityTypeConfiguration<TechnologyCapability>
{
    public void Configure(EntityTypeBuilder<TechnologyCapability> builder)
    {
        builder.ToTable("technology_capabilities", table => table.HasCheckConstraint("ck_technology_capabilities_content_status", "`content_status` in ('DRAFT','PUBLISHED','ARCHIVED')"));
        Mapping.Id(builder);
        builder.Property(x => x.Code).HasColumnName("code").HasMaxLength(80).IsRequired();
        builder.Property(x => x.ContentStatus).HasColumnName("content_status").HasMaxLength(20).HasConversion(Mapping.ContentStatusConverter).IsRequired();
        builder.Property(x => x.SortOrder).HasColumnName("sort_order").HasDefaultValue(0).IsRequired();
        Mapping.Audit(builder);
        builder.HasIndex(x => x.Code).IsUnique();
        builder.HasIndex(x => new { x.ContentStatus, x.SortOrder });
        builder.HasMany(x => x.Translations).WithOne(x => x.TechnologyCapability).HasForeignKey(x => x.TechnologyCapabilityId).OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class TechnologyTranslationConfiguration : IEntityTypeConfiguration<TechnologyTranslation>
{
    public void Configure(EntityTypeBuilder<TechnologyTranslation> builder)
    {
        builder.ToTable("technology_translations", table => table.HasCheckConstraint("ck_technology_translations_locale", "`locale` in ('zh-CN','en')"));
        Mapping.Id(builder);
        builder.Property(x => x.TechnologyCapabilityId).HasColumnName("technology_capability_id");
        builder.Property(x => x.Locale).HasColumnName("locale").HasMaxLength(10).IsRequired();
        builder.Property(x => x.Title).HasColumnName("title").HasMaxLength(180).IsRequired();
        builder.Property(x => x.Summary).HasColumnName("summary").HasMaxLength(600);
        builder.Property(x => x.Description).HasColumnName("description").HasColumnType("longtext");
        Mapping.Audit(builder);
        builder.HasIndex(x => new { x.TechnologyCapabilityId, x.Locale }).IsUnique();
    }
}

public sealed class IndustryConfiguration : IEntityTypeConfiguration<Industry>
{
    public void Configure(EntityTypeBuilder<Industry> builder)
    {
        builder.ToTable("industries", table => table.HasCheckConstraint("ck_industries_content_status", "`content_status` in ('DRAFT','PUBLISHED','ARCHIVED')"));
        Mapping.Id(builder);
        builder.Property(x => x.Code).HasColumnName("code").HasMaxLength(80).IsRequired();
        builder.Property(x => x.ContentStatus).HasColumnName("content_status").HasMaxLength(20).HasConversion(Mapping.ContentStatusConverter).IsRequired();
        builder.Property(x => x.SortOrder).HasColumnName("sort_order").HasDefaultValue(0).IsRequired();
        Mapping.Audit(builder);
        builder.HasIndex(x => x.Code).IsUnique();
        builder.HasIndex(x => new { x.ContentStatus, x.SortOrder });
        builder.HasMany(x => x.Translations).WithOne(x => x.Industry).HasForeignKey(x => x.IndustryId).OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class IndustryTranslationConfiguration : IEntityTypeConfiguration<IndustryTranslation>
{
    public void Configure(EntityTypeBuilder<IndustryTranslation> builder)
    {
        builder.ToTable("industry_translations", table => table.HasCheckConstraint("ck_industry_translations_locale", "`locale` in ('zh-CN','en')"));
        Mapping.Id(builder);
        builder.Property(x => x.IndustryId).HasColumnName("industry_id");
        builder.Property(x => x.Locale).HasColumnName("locale").HasMaxLength(10).IsRequired();
        builder.Property(x => x.Title).HasColumnName("title").HasMaxLength(180).IsRequired();
        builder.Property(x => x.Summary).HasColumnName("summary").HasMaxLength(600);
        builder.Property(x => x.Description).HasColumnName("description").HasColumnType("text");
        Mapping.Audit(builder);
        builder.HasIndex(x => new { x.IndustryId, x.Locale }).IsUnique();
    }
}

public sealed class ArticleConfiguration : IEntityTypeConfiguration<Article>
{
    public void Configure(EntityTypeBuilder<Article> builder)
    {
        builder.ToTable("articles", table => table.HasCheckConstraint("ck_articles_content_status", "`content_status` in ('DRAFT','PUBLISHED','ARCHIVED')"));
        Mapping.Id(builder);
        builder.Property(x => x.CategoryCode).HasColumnName("category_code").HasMaxLength(80).IsRequired();
        builder.Property(x => x.ContentStatus).HasColumnName("content_status").HasMaxLength(20).HasConversion(Mapping.ContentStatusConverter).IsRequired();
        builder.Property(x => x.IsFeatured).HasColumnName("is_featured").HasDefaultValue(false).IsRequired();
        builder.Property(x => x.PublishedAt).HasColumnName("published_at").HasColumnType("datetime(3)");
        builder.Property(x => x.CoverImageUrl).HasColumnName("cover_image_url").HasMaxLength(1000);
        Mapping.Audit(builder);
        builder.HasIndex(x => new { x.ContentStatus, x.PublishedAt });
        builder.HasMany(x => x.Translations).WithOne(x => x.Article).HasForeignKey(x => x.ArticleId).OnDelete(DeleteBehavior.Cascade);
    }
}

public sealed class ArticleTranslationConfiguration : IEntityTypeConfiguration<ArticleTranslation>
{
    public void Configure(EntityTypeBuilder<ArticleTranslation> builder)
    {
        builder.ToTable("article_translations", table => table.HasCheckConstraint("ck_article_translations_locale", "`locale` in ('zh-CN','en')"));
        Mapping.Id(builder);
        builder.Property(x => x.ArticleId).HasColumnName("article_id");
        builder.Property(x => x.Locale).HasColumnName("locale").HasMaxLength(10).IsRequired();
        builder.Property(x => x.Slug).HasColumnName("slug").HasMaxLength(200).IsRequired();
        builder.Property(x => x.Title).HasColumnName("title").HasMaxLength(240).IsRequired();
        builder.Property(x => x.Excerpt).HasColumnName("excerpt").HasMaxLength(800);
        builder.Property(x => x.ContentMarkdown).HasColumnName("content_markdown").HasColumnType("longtext").IsRequired();
        builder.Property(x => x.SeoTitle).HasColumnName("seo_title").HasMaxLength(255);
        builder.Property(x => x.SeoDescription).HasColumnName("seo_description").HasMaxLength(500);
        Mapping.Audit(builder);
        builder.HasIndex(x => new { x.ArticleId, x.Locale }).IsUnique();
        builder.HasIndex(x => new { x.Locale, x.Slug }).IsUnique();
    }
}

public sealed class ContactMessageConfiguration : IEntityTypeConfiguration<ContactMessage>
{
    public void Configure(EntityTypeBuilder<ContactMessage> builder)
    {
        builder.ToTable("contact_messages", table =>
        {
            table.HasCheckConstraint("ck_contact_messages_locale", "`locale` in ('zh-CN','en')");
            table.HasCheckConstraint("ck_contact_messages_status", "`status` in ('NEW','PROCESSING','REPLIED','CLOSED')");
            table.HasCheckConstraint("ck_contact_messages_privacy_consent", "`privacy_consent` = 1");
        });
        Mapping.Id(builder);
        builder.Property(x => x.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
        builder.Property(x => x.CompanyName).HasColumnName("company_name").HasMaxLength(160).IsRequired();
        builder.Property(x => x.Email).HasColumnName("email").HasMaxLength(254).IsRequired();
        builder.Property(x => x.Phone).HasColumnName("phone").HasMaxLength(40);
        builder.Property(x => x.IndustryCode).HasColumnName("industry_code").HasMaxLength(80);
        builder.Property(x => x.CooperationType).HasColumnName("cooperation_type").HasMaxLength(80).IsRequired();
        builder.Property(x => x.TargetProductCode).HasColumnName("target_product_code").HasMaxLength(80);
        builder.Property(x => x.Message).HasColumnName("message").HasMaxLength(5000).IsRequired();
        builder.Property(x => x.Locale).HasColumnName("locale").HasMaxLength(10).IsRequired();
        builder.Property(x => x.PrivacyConsent).HasColumnName("privacy_consent").IsRequired();
        builder.Property(x => x.PrivacyPolicyVersion).HasColumnName("privacy_policy_version").HasMaxLength(40).IsRequired();
        builder.Property(x => x.Status).HasColumnName("status").HasMaxLength(20).HasConversion(Mapping.ContactStatusConverter).IsRequired();
        builder.Property(x => x.CreatedAt).HasColumnName("created_at").HasColumnType("datetime(3)").IsRequired();
        builder.Property(x => x.ProcessedAt).HasColumnName("processed_at").HasColumnType("datetime(3)");
        builder.HasIndex(x => new { x.Status, x.CreatedAt });
        builder.HasIndex(x => x.CreatedAt);
    }
}

public sealed class SiteSettingConfiguration : IEntityTypeConfiguration<SiteSetting>
{
    public void Configure(EntityTypeBuilder<SiteSetting> builder)
    {
        builder.ToTable("site_settings", table => table.HasCheckConstraint("ck_site_settings_locale", "`locale` in ('zh-CN','en','und')"));
        Mapping.Id(builder);
        builder.Property(x => x.SettingKey).HasColumnName("setting_key").HasMaxLength(120).IsRequired();
        builder.Property(x => x.Locale).HasColumnName("locale").HasMaxLength(10).IsRequired();
        builder.Property(x => x.ValueJson).HasColumnName("value_json").HasColumnType("json").IsRequired();
        builder.Property(x => x.IsPublic).HasColumnName("is_public").HasDefaultValue(false).IsRequired();
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at").HasColumnType("datetime(3)").IsRequired();
        builder.HasIndex(x => new { x.SettingKey, x.Locale }).IsUnique();
    }
}
