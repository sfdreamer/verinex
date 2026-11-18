using Microsoft.EntityFrameworkCore;
using Verinex.Api.Domain.Entities;

namespace Verinex.Api.Data;

/// <summary>VERINEX MVP 业务数据上下文。</summary>
public sealed class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<CompanyProfile> CompanyProfiles => Set<CompanyProfile>();
    public DbSet<CompanyProfileTranslation> CompanyProfileTranslations => Set<CompanyProfileTranslation>();
    public DbSet<Solution> Solutions => Set<Solution>();
    public DbSet<SolutionTranslation> SolutionTranslations => Set<SolutionTranslation>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductTranslation> ProductTranslations => Set<ProductTranslation>();
    public DbSet<TechnologyCapability> TechnologyCapabilities => Set<TechnologyCapability>();
    public DbSet<TechnologyTranslation> TechnologyTranslations => Set<TechnologyTranslation>();
    public DbSet<Industry> Industries => Set<Industry>();
    public DbSet<IndustryTranslation> IndustryTranslations => Set<IndustryTranslation>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<ArticleTranslation> ArticleTranslations => Set<ArticleTranslation>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasCharSet("utf8mb4");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
