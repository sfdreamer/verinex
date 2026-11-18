using System.Text;
using System.Xml;
using Microsoft.EntityFrameworkCore;
using Verinex.Api.Data;
using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Features.Sitemap;

public interface ISitemapService
{
    /// <summary>依据已发布内容生成 sitemap.xml。</summary>
    Task<string> BuildAsync(string baseUrl, CancellationToken cancellationToken);
}

/// <summary>
/// sitemap 只包含已发布且存在对应语言翻译的内容；
/// 一级页面固定输出 zh / en 两套地址，并附带 hreflang 互指。
/// </summary>
public sealed class SitemapService(AppDbContext db) : ISitemapService
{
    private static readonly string[] StaticPages =
        ["", "about", "solutions", "products", "technology", "insights", "contact"];

    private static readonly string[] Locales = ["zh", "en"];

    public async Task<string> BuildAsync(string baseUrl, CancellationToken cancellationToken)
    {
        var root = baseUrl.TrimEnd('/');
        var entries = new List<SitemapEntry>();

        foreach (var locale in Locales)
        {
            foreach (var page in StaticPages)
            {
                entries.Add(new SitemapEntry($"{root}/{locale}{(page.Length == 0 ? string.Empty : "/" + page)}", null, 0.8m));
            }
        }

        // 解决方案：按语言分别输出存在翻译的详情页
        var solutionRows = await db.SolutionTranslations.AsNoTracking()
            .Where(x => x.Solution.ContentStatus == ContentStatus.Published)
            .Select(x => new { x.Locale, x.Slug, x.Solution.UpdatedAt })
            .ToListAsync(cancellationToken);
        foreach (var row in solutionRows)
        {
            var locale = row.Locale == "en" ? "en" : "zh";
            entries.Add(new SitemapEntry($"{root}/{locale}/solutions/{row.Slug}", row.UpdatedAt, 0.7m));
        }

        var productRows = await db.ProductTranslations.AsNoTracking()
            .Where(x => x.Product.ContentStatus == ContentStatus.Published)
            .Select(x => new { x.Locale, x.Slug, x.Product.UpdatedAt })
            .ToListAsync(cancellationToken);
        foreach (var row in productRows)
        {
            var locale = row.Locale == "en" ? "en" : "zh";
            entries.Add(new SitemapEntry($"{root}/{locale}/products/{row.Slug}", row.UpdatedAt, 0.7m));
        }

        var articleRows = await db.ArticleTranslations.AsNoTracking()
            .Where(x => x.Article.ContentStatus == ContentStatus.Published && x.Article.PublishedAt != null)
            .Select(x => new { x.Locale, x.Slug, x.Article.UpdatedAt })
            .ToListAsync(cancellationToken);
        foreach (var row in articleRows)
        {
            var locale = row.Locale == "en" ? "en" : "zh";
            entries.Add(new SitemapEntry($"{root}/{locale}/insights/{row.Slug}", row.UpdatedAt, 0.6m));
        }

        return Serialize(entries);
    }

    private static string Serialize(IReadOnlyList<SitemapEntry> entries)
    {
        var settings = new XmlWriterSettings { Indent = true, Encoding = new UTF8Encoding(false) };
        using var stream = new MemoryStream();
        using (var writer = XmlWriter.Create(stream, settings))
        {
            writer.WriteStartDocument();
            writer.WriteStartElement("urlset", "http://www.sitemaps.org/schemas/sitemap/0.9");

            foreach (var entry in entries.DistinctBy(x => x.Location))
            {
                writer.WriteStartElement("url");
                writer.WriteElementString("loc", entry.Location);
                if (entry.LastModified.HasValue)
                {
                    writer.WriteElementString("lastmod", entry.LastModified.Value.ToString("yyyy-MM-dd"));
                }
                writer.WriteElementString("priority", entry.Priority.ToString("0.0", System.Globalization.CultureInfo.InvariantCulture));
                writer.WriteEndElement();
            }

            writer.WriteEndElement();
            writer.WriteEndDocument();
        }

        return Encoding.UTF8.GetString(stream.ToArray());
    }

    private sealed record SitemapEntry(string Location, DateTime? LastModified, decimal Priority);
}
