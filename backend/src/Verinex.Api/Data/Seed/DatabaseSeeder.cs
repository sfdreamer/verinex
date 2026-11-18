using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Verinex.Api.Domain.Entities;
using Verinex.Api.Domain.Enums;

namespace Verinex.Api.Data.Seed;

/// <summary>
/// MVP 基线数据。所有记录以稳定 code、slug 或 setting_key 判重；只补缺失记录，绝不覆盖人工维护内容。
/// </summary>
public static class DatabaseSeeder
{
    private static readonly DateTime SeedTime = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    public static async Task SeedAsync(AppDbContext db, CancellationToken cancellationToken = default)
    {
        await SeedCompanyAsync(db, cancellationToken);
        await SeedSolutionsAsync(db, cancellationToken);
        await SeedProductsAsync(db, cancellationToken);
        await SeedTechnologiesAsync(db, cancellationToken);
        await SeedIndustriesAsync(db, cancellationToken);
        await SeedArticlesAsync(db, cancellationToken);
        await SeedSettingsAsync(db, cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
    }

    private static async Task SeedCompanyAsync(AppDbContext db, CancellationToken ct)
    {
        if (await db.CompanyProfiles.AnyAsync(x => x.Code == "main", ct)) return;

        db.CompanyProfiles.Add(new CompanyProfile
        {
            Code = "main",
            IsActive = true,
            CreatedAt = SeedTime,
            UpdatedAt = SeedTime,
            Translations =
            [
                new CompanyProfileTranslation
                {
                    Locale = "zh-CN", CompanyName = "维真科技", BrandName = "VERINEX",
                    Tagline = "以可信为基，以智能致远。",
                    Overview = "VERINEX 专注于人工智能技术、数据智能与企业智能化解决方案的规划与建设，致力于让数据与 AI 能力以可靠、可治理的方式服务真实业务。",
                    Mission = "让人工智能创造真实价值。", Vision = "成为值得信赖的企业智能化创新伙伴。",
                    ValuesText = JsonSerializer.Serialize(new[] { "真实", "专业", "创新", "责任" }),
                    SeoTitle = "VERINEX 维真科技｜可信企业智能",
                    SeoDescription = "了解 VERINEX 的企业智能、数据智能与可信 AI 技术方向。",
                    CreatedAt = SeedTime, UpdatedAt = SeedTime
                },
                new CompanyProfileTranslation
                {
                    Locale = "en", CompanyName = "VERINEX TECHNOLOGIES", BrandName = "VERINEX",
                    Tagline = "Intelligence Built on Trust.",
                    Overview = "VERINEX plans and builds artificial intelligence, data intelligence, and enterprise AI solutions so that data and AI capabilities can serve real business needs in a reliable and governable way.",
                    Mission = "Create real value through artificial intelligence.", Vision = "Be a trusted partner for enterprise intelligence and innovation.",
                    ValuesText = JsonSerializer.Serialize(new[] { "Authenticity", "Professionalism", "Innovation", "Responsibility" }),
                    SeoTitle = "VERINEX TECHNOLOGIES | Trusted Enterprise Intelligence",
                    SeoDescription = "Explore VERINEX directions in enterprise intelligence, data intelligence, and trustworthy AI.",
                    CreatedAt = SeedTime, UpdatedAt = SeedTime
                }
            ]
        });
    }

    private static async Task SeedSolutionsAsync(AppDbContext db, CancellationToken ct)
    {
        var items = new[]
        {
            Solution("data-intelligence", 1, true, "data-intelligence", "数据智能", "Data Intelligence", "以可治理的数据基础支持知识组织、检索与分析。", "Build governable data foundations for knowledge organization, retrieval, and analysis.", "数据治理、企业知识库、知识图谱与语料管理构成可持续演进的数据智能基础。", "Data governance, enterprise knowledge bases, knowledge graphs, and corpus management form an evolvable data intelligence foundation."),
            Solution("enterprise-ai", 2, true, "enterprise-ai", "企业 AI 解决方案", "Enterprise AI Solutions", "围绕业务场景规划大模型应用、RAG、智能体与工作流。", "Plan LLM applications, RAG, agents, and intelligent workflows around real business scenarios.", "从需求梳理、知识接入到应用集成，强调可控、可评估与可持续运营。", "From requirements and knowledge integration to application delivery, the approach emphasizes control, evaluation, and sustainable operations."),
            Solution("brand-intelligence", 3, true, "brand-intelligence", "品牌智能", "Brand Intelligence", "面向生成式搜索环境规划品牌认知分析与内容语义优化。", "Plan brand perception analysis and semantic content optimization for generative search environments.", "通过结构化内容、可见度观察与语义一致性建设，支持品牌信息在 AI 时代被准确理解。", "Structured content, visibility observation, and semantic consistency help brand information remain understandable in the AI era."),
            Solution("ai-content", 4, false, "ai-content-solutions", "AI 内容解决方案", "AI Content Solutions", "以人工审核与质量治理为前提，规划多模态内容生产流程。", "Plan multimodal content workflows with human review and quality governance built in.", "覆盖内容生成、处理、管理和质量审核，帮助团队建立可管理的内容工作流。", "Cover generation, processing, management, and quality review to establish manageable content workflows."),
            Solution("research-insights", 5, false, "data-research-insights", "数据研究与洞察", "Data Research & Insights", "结合数据分析、行业研究与可视化形成可追溯的洞察。", "Combine data analysis, industry research, and visualization into traceable insights.", "围绕明确问题组织数据、分析方法与呈现方式，避免用未经验证的结论替代证据。", "Organize data, methods, and presentation around clear questions without substituting unverified claims for evidence.")
        };

        var existing = await db.Solutions.Select(x => x.Code).ToListAsync(ct);
        db.Solutions.AddRange(items.Where(x => !existing.Contains(x.Code)));
    }

    private static Solution Solution(string code, int order, bool featured, string slug, string zhTitle, string enTitle, string zhSummary, string enSummary, string zhBody, string enBody) => new()
    {
        Code = code, ContentStatus = ContentStatus.Published, SortOrder = order, IsFeatured = featured,
        CreatedAt = SeedTime, UpdatedAt = SeedTime,
        Translations =
        [
            new() { Locale = "zh-CN", Slug = slug, Title = zhTitle, Summary = zhSummary, BodyMarkdown = zhBody, SeoTitle = zhTitle + "｜VERINEX", SeoDescription = zhSummary, CreatedAt = SeedTime, UpdatedAt = SeedTime },
            new() { Locale = "en", Slug = slug, Title = enTitle, Summary = enSummary, BodyMarkdown = enBody, SeoTitle = enTitle + " | VERINEX", SeoDescription = enSummary, CreatedAt = SeedTime, UpdatedAt = SeedTime }
        ]
    };

    private static async Task SeedProductsAsync(AppDbContext db, CancellationToken ct)
    {
        var items = new[]
        {
            Product("vericorpus", 1, true, "VERICORPUS", "Enterprise Data & Knowledge Platform", "企业数据与知识资产平台", new[] { "数据治理", "企业知识库", "知识图谱", "语料管理" }, new[] { "Data governance", "Enterprise knowledge base", "Knowledge graph", "Corpus management" }),
            Product("verimind", 2, true, "VERIMIND", "Enterprise AI Intelligence Platform", "企业 AI 智能应用平台", new[] { "AI 智能体", "RAG", "智能问答", "智能工作流", "多模型接入" }, new[] { "AI agents", "RAG", "Intelligent Q&A", "Intelligent workflows", "Multi-model integration" }),
            Product("veristudio", 3, true, "VERISTUDIO", "AI Content & Brand Platform", "AI 内容与品牌智能平台", new[] { "AI 内容生成", "多模态处理", "内容管理", "GEO 内容优化" }, new[] { "AI content generation", "Multimodal processing", "Content management", "GEO content optimization" }),
            Product("veriinsight", 4, false, "VERIINSIGHT", "Data Analytics & Research Platform", "数据分析与行业洞察平台", new[] { "数据分析", "行业研究", "数据可视化", "智能报告" }, new[] { "Data analysis", "Industry research", "Data visualization", "Intelligent reporting" }),
            Product("veribrand", 5, false, "VERIBRAND", "AI Brand Intelligence Platform", "AI 品牌认知与 GEO 平台", new[] { "品牌可见度观察", "品牌认知分析", "生成式搜索优化", "竞争语义分析" }, new[] { "Brand visibility observation", "Brand perception analysis", "Generative search optimization", "Competitive semantic analysis" })
        };
        var existing = await db.Products.Select(x => x.Code).ToListAsync(ct);
        db.Products.AddRange(items.Where(x => !existing.Contains(x.Code)));
    }

    private static Product Product(string code, int order, bool featured, string name, string subtitle, string zhSummary, string[] zhFeatures, string[] enFeatures) => new()
    {
        Code = code, ProductStage = ProductStage.Planned, ContentStatus = ContentStatus.Published, SortOrder = order, IsFeatured = featured,
        CreatedAt = SeedTime, UpdatedAt = SeedTime,
        Translations =
        [
            new() { Locale = "zh-CN", Slug = code, Name = name, Subtitle = subtitle, Summary = zhSummary + "（规划中）", Description = "该产品目前处于规划阶段，页面内容用于说明产品方向，不代表已正式发布或完成交付。", FeaturesJson = JsonSerializer.Serialize(zhFeatures), SeoTitle = name + "（规划中）｜VERINEX", SeoDescription = zhSummary, CreatedAt = SeedTime, UpdatedAt = SeedTime },
            new() { Locale = "en", Slug = code, Name = name, Subtitle = subtitle, Summary = subtitle + " (Planned)", Description = "This product is currently planned. The page describes its intended direction and does not represent a released or delivered product.", FeaturesJson = JsonSerializer.Serialize(enFeatures), SeoTitle = name + " (Planned) | VERINEX", SeoDescription = subtitle, CreatedAt = SeedTime, UpdatedAt = SeedTime }
        ]
    };

    private static async Task SeedTechnologiesAsync(AppDbContext db, CancellationToken ct)
    {
        var definitions = new[]
        {
            ("llm", "大语言模型", "Large Language Models", "关注模型选型、接入、评估与安全边界。", "Model selection, integration, evaluation, and safety boundaries."),
            ("rag", "检索增强生成", "Retrieval-Augmented Generation", "将可追溯的企业知识检索与生成能力结合。", "Combine traceable enterprise knowledge retrieval with generation."),
            ("ai-agents", "AI 智能体", "AI Agents", "围绕明确权限和流程边界编排智能任务。", "Orchestrate intelligent tasks within explicit permissions and process boundaries."),
            ("knowledge-graph", "知识图谱", "Knowledge Graph", "以结构化关系支持知识组织和业务理解。", "Use structured relationships to support knowledge organization and business understanding."),
            ("data-engineering", "数据工程", "Data Engineering", "建设可治理、可观测、可复用的数据链路。", "Build governable, observable, and reusable data pipelines."),
            ("multimodal-ai", "多模态 AI", "Multimodal AI", "规划文本、图像等多种信息形态的协同处理。", "Plan coordinated processing across text, images, and other information forms."),
            ("intelligent-automation", "智能自动化", "Intelligent Automation", "在人工监督下连接规则、数据与智能能力。", "Connect rules, data, and intelligence under human oversight."),
            ("enterprise-ai-integration", "企业 AI 集成", "Enterprise AI Integration", "将 AI 能力与现有系统、身份和治理体系衔接。", "Connect AI capabilities with existing systems, identity, and governance.")
        };
        var existing = await db.TechnologyCapabilities.Select(x => x.Code).ToListAsync(ct);
        var order = 0;
        foreach (var item in definitions)
        {
            order++;
            if (existing.Contains(item.Item1)) continue;
            db.TechnologyCapabilities.Add(new TechnologyCapability
            {
                Code = item.Item1, ContentStatus = ContentStatus.Published, SortOrder = order, CreatedAt = SeedTime, UpdatedAt = SeedTime,
                Translations =
                [
                    new() { Locale = "zh-CN", Title = item.Item2, Summary = item.Item4, Description = item.Item4, CreatedAt = SeedTime, UpdatedAt = SeedTime },
                    new() { Locale = "en", Title = item.Item3, Summary = item.Item5, Description = item.Item5, CreatedAt = SeedTime, UpdatedAt = SeedTime }
                ]
            });
        }
    }

    private static async Task SeedIndustriesAsync(AppDbContext db, CancellationToken ct)
    {
        var definitions = new[]
        {
            ("manufacturing", "智能制造", "Intelligent Manufacturing", "探索数据治理、知识协同和智能流程在制造场景中的应用方向。", "Explore data governance, knowledge collaboration, and intelligent workflows for manufacturing."),
            ("technology-internet", "科技与互联网", "Technology & Internet", "面向快速演进的数字业务组织知识、数据与 AI 应用能力。", "Organize knowledge, data, and AI application capabilities for evolving digital businesses."),
            ("consumer-retail", "消费与零售", "Consumer & Retail", "以合规数据和内容治理支持消费者洞察与运营协同。", "Support consumer insight and operational collaboration with compliant data and content governance."),
            ("professional-services", "专业服务", "Professional Services", "通过知识工程与可追溯分析提升专业信息的复用效率。", "Improve reuse of professional information through knowledge engineering and traceable analysis."),
            ("enterprise-groups", "大型企业与集团", "Enterprises & Groups", "围绕多系统环境规划统一的数据、知识和 AI 治理方式。", "Plan unified data, knowledge, and AI governance across complex enterprise systems.")
        };
        var existing = await db.Industries.Select(x => x.Code).ToListAsync(ct);
        var order = 0;
        foreach (var item in definitions)
        {
            order++;
            if (existing.Contains(item.Item1)) continue;
            db.Industries.Add(new Industry
            {
                Code = item.Item1, ContentStatus = ContentStatus.Published, SortOrder = order, CreatedAt = SeedTime, UpdatedAt = SeedTime,
                Translations =
                [
                    new() { Locale = "zh-CN", Title = item.Item2, Summary = item.Item4, Description = item.Item4, CreatedAt = SeedTime, UpdatedAt = SeedTime },
                    new() { Locale = "en", Title = item.Item3, Summary = item.Item5, Description = item.Item5, CreatedAt = SeedTime, UpdatedAt = SeedTime }
                ]
            });
        }
    }

    private static async Task SeedArticlesAsync(AppDbContext db, CancellationToken ct)
    {
        var articles = new[]
        {
            Article("enterprise-ai", true, new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc), "sample-enterprise-ai-readiness", "示例：企业 AI 应用准备度思考", "Sample: Thinking About Enterprise AI Readiness", "本文为网站结构演示内容，不代表已完成的客户项目或正式研究结论。", "This is sample website content and does not represent a delivered client project or a formal research finding."),
            Article("data-intelligence", true, new DateTime(2026, 4, 18, 0, 0, 0, DateTimeKind.Utc), "sample-governable-knowledge", "示例：从可治理数据走向企业知识", "Sample: From Governable Data to Enterprise Knowledge", "本文为示例文章，用于展示数据治理与知识组织的内容结构。", "This sample article demonstrates a content structure for data governance and knowledge organization."),
            Article("ai-technology", false, new DateTime(2026, 3, 16, 0, 0, 0, DateTimeKind.Utc), "sample-rag-evaluation", "示例：RAG 评估应关注什么", "Sample: What to Consider When Evaluating RAG", "本文为示例文章，仅讨论评估框架，不提供未经验证的性能数字。", "This sample article discusses an evaluation framework without presenting unverified performance figures."),
            Article("enterprise-ai", false, new DateTime(2026, 2, 12, 0, 0, 0, DateTimeKind.Utc), "sample-human-oversight", "示例：智能工作流中的人工监督", "Sample: Human Oversight in Intelligent Workflows", "本文为示例文章，用于说明可控流程与人工审核的重要性。", "This sample article illustrates the importance of controlled processes and human review."),
            Article("brand-intelligence", false, new DateTime(2026, 1, 10, 0, 0, 0, DateTimeKind.Utc), "sample-brand-semantics", "示例：生成式搜索环境中的品牌语义", "Sample: Brand Semantics in Generative Search", "本文为示例文章，不包含任何客户监测结果或市场份额结论。", "This sample article contains no client monitoring results or market-share claims.")
        };
        var slugs = await db.ArticleTranslations.Select(x => x.Slug).ToListAsync(ct);
        db.Articles.AddRange(articles.Where(x => !x.Translations.Any(t => slugs.Contains(t.Slug))));
    }

    private static Article Article(string category, bool featured, DateTime publishedAt, string slug, string zhTitle, string enTitle, string zhExcerpt, string enExcerpt) => new()
    {
        CategoryCode = category, ContentStatus = ContentStatus.Published, IsFeatured = featured, PublishedAt = publishedAt,
        CreatedAt = SeedTime, UpdatedAt = SeedTime,
        Translations =
        [
            new() { Locale = "zh-CN", Slug = slug, Title = zhTitle, Excerpt = zhExcerpt, ContentMarkdown = "## 示例说明\n\n" + zhExcerpt + "\n\n内容围绕方法与规划方向展开，所有表述均为非事实性的能力说明。", SeoTitle = zhTitle + "｜VERINEX", SeoDescription = zhExcerpt, CreatedAt = SeedTime, UpdatedAt = SeedTime },
            new() { Locale = "en", Slug = slug, Title = enTitle, Excerpt = enExcerpt, ContentMarkdown = "## Sample notice\n\n" + enExcerpt + "\n\nThe content discusses methods and planned directions only; all statements are non-factual capability descriptions.", SeoTitle = enTitle + " | VERINEX", SeoDescription = enExcerpt, CreatedAt = SeedTime, UpdatedAt = SeedTime }
        ]
    };

    private static async Task SeedSettingsAsync(AppDbContext db, CancellationToken ct)
    {
        var settings = new[]
        {
            Setting("contact_email", JsonSerializer.Serialize("business@verinex.ai")),
            Setting("privacy_policy_version", JsonSerializer.Serialize("1.0")),
            Setting("icp_number", JsonSerializer.Serialize(string.Empty)),
            Setting("social_links", JsonSerializer.Serialize(Array.Empty<object>()))
        };
        var existing = await db.SiteSettings.Where(x => x.Locale == "und").Select(x => x.SettingKey).ToListAsync(ct);
        db.SiteSettings.AddRange(settings.Where(x => !existing.Contains(x.SettingKey)));
    }

    private static SiteSetting Setting(string key, string valueJson) => new()
    {
        SettingKey = key, Locale = "und", ValueJson = valueJson, IsPublic = true, UpdatedAt = SeedTime
    };
}
