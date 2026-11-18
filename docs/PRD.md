# VERINEX 企业官方网站产品需求文档（PRD）

**项目名称：** VERINEX Technologies Official Website  
**项目版本：** V1.1（开发基线，已与 API / DATABASE / ARCHITECTURE 对齐）  
**产品类型：** 企业品牌展示与 AI 科技产品官网  
**网站语言：** 中文 / English  
**目标设备：** PC、平板、移动端  
**后端技术：** ASP.NET Core 10 + C#  
**前端技术：** Vue 3 + TypeScript + Vite  
**数据库：** MySQL + Entity Framework Core  
**开发方式：** AI Agent 辅助开发

---

## 1. 项目背景与定位

### 1.1 项目背景

VERINEX 是一个定位于综合型人工智能科技企业的品牌概念，专注于人工智能技术研发、数据智能、企业 AI 平台及数字化解决方案。

公司通过自主规划的 AI 产品平台和行业解决方案，帮助企业实现数据资产化、业务智能化和数字化创新。

本项目旨在构建 VERINEX 的官方企业网站，形成统一的品牌展示、产品介绍、技术能力展示和商务合作入口。

### 1.2 品牌定位

- 品牌名称：VERINEX
- 公司名称：VERINEX TECHNOLOGIES
- 中文品牌名：维真科技
- 企业定位：综合型人工智能科技企业
- 品牌口号：Intelligence Built on Trust.
- 中文口号：以可信为基，以智能致远。

### 1.3 核心宣传语

**Transforming Data into Intelligence. Empowering the Future of Business.**

将数据转化为智能，赋能企业未来。

---

## 2. 产品目标

### 2.1 核心目标

1. 建立统一、专业的企业品牌形象。
2. 展示公司的 AI 技术研发方向。
3. 展示五大核心业务板块。
4. 展示五大自主产品平台。
5. 提供中英文双语访问能力。
6. 建立商务合作和客户联系渠道。
7. 支持企业内容持续更新。

### 2.2 目标用户

- 企业管理者与决策者
- 企业 IT 与数字化转型负责人
- AI 技术研发人员
- 品牌与市场营销负责人
- 潜在商务合作伙伴

### 2.3 核心转化目标

引导访客：

- 了解 VERINEX。
- 了解核心技术和产品。
- 浏览解决方案。
- 提交商务合作需求。
- 建立进一步联系。

---

## 3. 网站信息架构

一级导航：

1. HOME：首页
2. ABOUT US：关于我们
3. SOLUTIONS：解决方案
4. PRODUCTS：产品中心
5. TECHNOLOGY：技术能力
6. INSIGHTS：行业洞察
7. CONTACT：联系我们

全站提供中英文语言切换。

建议使用 `/zh/` 和 `/en/` 作为语言路径前缀。

---

## 4. 页面功能需求

### 4.1 首页 Home

**目标：** 在最短时间内建立品牌认知，展示公司业务、技术和产品。

页面模块：

1. Header 导航栏
   - VERINEX 品牌 Logo
   - 一级导航
   - 中英文切换
   - Contact Us 按钮
2. Hero 首屏
   - 主标题：Intelligence Built on Trust.
   - 副标题：Transforming Data into Intelligence. Empowering the Future of Business.
   - 科技感动态视觉背景
   - Explore Solutions 按钮
   - Discover Products 按钮
3. About VERINEX
   - 企业简介
   - 企业定位
   - 品牌理念
   - Learn More 跳转
4. Core Solutions
   - 五大业务板块
   - 每个业务提供简短介绍
   - 支持进入详情页面
5. Our Products
   - 五大产品平台
   - 产品图标、名称、定位、核心能力
   - 支持进入产品详情页
6. Technology & Innovation
   - AI 大模型
   - RAG 与知识工程
   - Agent 智能体
   - 多模态 AI
   - 数据智能与分析
7. Industries We Serve
   - 智能制造
   - 科技与互联网
   - 消费与零售
   - 专业服务
   - 大型企业与集团
   - 说明：设计稿未单独提供该区块，V1 按本节要求实现，复用解决方案卡片的视觉语言。
8. Insights
   - 展示最新行业文章
   - 展示技术研究内容
   - 支持进入文章详情
9. Contact CTA
   - Let's Build the Intelligent Future.
   - 联系我们入口
10. Footer
    - 公司简介
    - 页面导航
    - 联系方式
    - 社交媒体入口（资料确认后展示）
    - 版权信息
    - 隐私政策

### 4.2 关于我们 About Us

页面模块：

- Company Overview：公司简介
- Mission：企业使命
- Vision：企业愿景
- Values：核心价值观
- Our Philosophy：技术理念
- Development：发展历程（V1 不展示，待真实资料确认后启用）
- Team：团队介绍（V1 不展示，待真实资料确认后启用）

V1 页面不得展示成立年份、员工规模、专利数量、客户满意度、发展历程时间轴和管理团队人员信息。设计稿中的对应区块改为使命、愿景、价值观和技术理念的延展展示。

企业使命：让人工智能创造真实价值。

企业愿景：成为值得信赖的企业智能化创新伙伴。

核心价值观：真实、专业、创新、责任。

### 4.3 解决方案 Solutions

包含五大业务：

1. Data Intelligence
   - 数据采集与治理
   - 企业知识库
   - 知识图谱
   - 语料管理
2. Enterprise AI Solutions
   - 大模型应用
   - RAG 系统
   - AI Agent
   - 智能工作流
   - 私有化部署
3. Brand Intelligence
   - GEO
   - AI 品牌认知分析
   - AI 搜索可见度监测
   - 品牌语义优化
4. AI Content Solutions
   - AI 内容生成
   - 多模态内容处理
   - 内容管理
   - 内容质量审核
5. Data Research & Insights
   - 行业研究
   - 市场分析
   - 消费者偏好研究
   - 数据可视化

每个解决方案需要独立详情页面，包含业务介绍、核心能力、应用场景及联系入口。

详情页设计稿未单独提供，V1 由 Agent 按总览页的设计语言实现统一详情模板（见第 12 章）。页面上的行业筛选按钮 V1 不做真实筛选：改为锚点跳转或移除，不保留无数据支撑的交互。

### 4.4 产品中心 Products

五大产品平台：

**VERICORPUS**

Enterprise Data & Knowledge Platform

企业数据与知识资产平台。

核心能力：

- 数据治理
- 企业知识库
- 知识图谱
- 语料管理

**VERIMIND**

Enterprise AI Intelligence Platform

企业 AI 智能应用平台。

核心能力：

- AI Agent
- RAG
- 智能问答
- 智能工作流
- 多模型接入

**VERISTUDIO**

AI Content & Brand Platform

AI 内容与品牌智能平台。

核心能力：

- AI 内容生成
- 多模态处理
- 内容管理
- GEO 内容优化

**VERIINSIGHT**

Data Analytics & Research Platform

数据分析与行业洞察平台。

核心能力：

- 数据分析
- 行业研究
- 数据可视化
- 智能报告

**VERIBRAND**

AI Brand Intelligence Platform

AI 品牌认知与 GEO 平台。

核心能力：

- AI 品牌可见度监测
- 品牌认知分析
- 生成式搜索优化
- 竞争品牌分析

每个产品需要独立详情页面。

产品内容需要区分已上线、开发中和规划中状态，不得将规划中的产品描述为已经成熟交付的产品。

V1 详情页统一模板实现，产品卡片与详情页均需展示成熟度标签；未获确认的产品一律按 PLANNED 展示。设计稿中的“下载白皮书 / 查看产品文档”入口 V1 不实现，不保留无效链接。

### 4.5 技术能力 Technology

展示 VERINEX 的技术方向：

- Large Language Models
- Retrieval-Augmented Generation
- AI Agents
- Knowledge Graph
- Data Engineering
- Multimodal AI
- Intelligent Automation
- Enterprise AI Integration

页面重点采用技术可视化和模块化架构展示。

不虚构专利、研发成果、技术指标或实际部署案例。

### 4.6 行业洞察 Insights

功能：

- 文章列表
- 文章分类
- 文章详情
- 发布时间
- 封面图片
- 中英文内容
- 相关推荐

内容分类：

- AI Technology
- Enterprise AI
- Data Intelligence
- Brand Intelligence
- Industry Research

分类以本节五项为唯一边界，不新增设计稿中的“客户案例”分类（无可信案例支撑）。文章详情页同样由统一模板实现，相关推荐由同一分类下的其他已发布文章补齐。

### 4.7 联系我们 Contact

表单字段（V1 最终基线，PRD / API / DATABASE 三处一致）：

| 字段 | 必填 | 控件 | 规则 |
|---|---|---|---|
| 姓名 name | 是 | 输入框 | 1–100 字符 |
| 公司名称 companyName | 是 | 输入框 | 最长 160 字符；与设计稿一致，B2B 场景必需 |
| 工作邮箱 email | 是 | 输入框 | 合法邮箱，最长 254 字符 |
| 联系电话 phone | 否 | 输入框 | 最长 40 字符 |
| 所属行业 industry | 否 | 下拉 | 取值来自 `/api/v1/industries` |
| 合作方向 cooperationType | 是 | 下拉 | 五大业务板块固定编码白名单 |
| 意向产品 targetProduct | 否 | 下拉 | 五大产品 + “暂不确定” |
| 需求描述 message | 是 | 多行文本 | 1–5000 字符 |
| 隐私政策同意 privacyConsent | 是 | 勾选框 | 必须勾选 |

与设计稿的差异处理：设计稿的“意向产品/方案”拆分为“合作方向（必填）+ 意向产品（选填）”；设计稿缺失的“需求描述”必须补入，且为必填。

页面上的办公地点、电话、企业邮箱和 FAQ 中的具体承诺（如交付周期）均属未确认信息，V1 只保留企业邮箱与表单入口，其余待确认后再上线（见第 12 章）。

提交后：

1. 前端进行基础验证。
2. ASP.NET Core 进行服务端验证。
3. 后端进行频率限制及反垃圾校验。
4. 数据保存到 MySQL。
5. 后端可触发商务通知邮件。
6. 前端展示提交成功或失败状态。

---

## 5. 双语系统需求

支持：

- 中文简体 zh-CN
- 英文 en

功能要求：

1. 提供全站语言切换。
2. 页面切换后保持对应语言。
3. 产品、解决方案、文章均支持双语内容。
4. 不允许中英文混杂。
5. URL 包含语言前缀。
6. 支持独立 SEO Title、Description。
7. 支持语言对应的 Open Graph 元信息。

---

## 6. 技术架构

### 6.1 技术基线

- 前端：Vue 3 + TypeScript + Vite，Vue Router / Pinia / Vue I18n / Axios，可选 GSAP；Three.js 仅在确有 3D 视觉需求时引入。
- 后端：ASP.NET Core 10 Web API + C#，EF Core 10，OpenAPI。
- 数据库：MySQL 8.4 LTS。
- 部署：Docker Compose + Nginx + HTTPS，同源部署；CI/CD 后续配置。

以上是已确认基线，Agent 不得更换。目录结构、分层职责、依赖版本锁定、部署拓扑与 ADR 统一见 `docs/ARCHITECTURE.md`，本文不重复维护。

### 6.2 数据库

MySQL + Entity Framework Core

初步数据表：

- company_profiles
- company_profile_translations
- solutions
- solution_translations
- products
- product_translations
- technology_capabilities
- technology_translations
- industries
- industry_translations
- articles
- article_translations
- contact_messages
- site_settings
- admin_users（后台阶段）

采用统一的语言标识管理中英文内容。媒体资源表（media_assets）V1 不启用，产品与文章封面直接存图片 URL；详细字段以 `docs/DATABASE.md` 为准。

### 6.3 部署

Docker Compose 编排 Nginx（前端静态资源 + `/api` 反向代理）、ASP.NET Core API 和 MySQL 持久化卷；生产启用 HTTPS。详细拓扑见 `docs/ARCHITECTURE.md` 第 13 章。

---

## 7. API 初步规划

| API                           | 方法   | 功能       |
| ----------------------------- | ---- | -------- |
| /api/v1/site/overview         | GET  | 首页聚合数据   |
| /api/v1/site/settings         | GET  | 公开站点配置   |
| /api/v1/company               | GET  | 企业介绍     |
| /api/v1/solutions             | GET  | 解决方案列表   |
| /api/v1/solutions/{slug}      | GET  | 解决方案详情   |
| /api/v1/products              | GET  | 产品列表     |
| /api/v1/products/{slug}       | GET  | 产品详情     |
| /api/v1/technologies          | GET  | 技术能力     |
| /api/v1/industries            | GET  | 行业列表     |
| /api/v1/insights              | GET  | 文章列表     |
| /api/v1/insights/{slug}       | GET  | 文章详情     |
| /api/v1/contact               | POST | 商务合作留言   |

所有内容查询接口支持 `lang=zh-CN|en` 参数。详细字段、DTO 与错误码以 `docs/API.md` 为准，本节只保留接口概览。

---

## 8. 非功能需求

### 性能

- 首页资源按需加载。
- 图片使用 WebP/AVIF 等合适格式。
- 动画不能明显阻塞主线程。
- 核心页面优化首屏加载。

### 安全

- 后端验证所有外部输入。
- 防止 XSS、SQL 注入和恶意表单提交。
- 联系接口进行频率限制。
- 敏感配置使用环境变量。
- 后台认证功能在第二阶段实现。

### SEO

- 页面独立 Title 和 Description。
- sitemap.xml。
- robots.txt。
- Open Graph。
- 语义化 HTML。
- 中英文页面分别建立可索引地址。
- 为主要业务和产品页面配置结构化数据。
- 渲染方式：七个一级页面与语言首页在构建期预渲染为独立 HTML；详情页内容来自数据库，保持客户端渲染并输出 meta / canonical / hreflang，sitemap 由后端依据已发布内容生成。

### 兼容性

- Chrome
- Edge
- Safari
- Firefox
- iOS Safari
- Android Chrome

### 响应式

- PC
- 平板
- 手机

---

## 9. 项目开发范围

### 第一阶段：官网 MVP

必须完成：

- 品牌视觉体系
- 首页
- 关于我们
- 解决方案（含详情页模板）
- 产品中心（含详情页模板）
- 技术能力
- 行业洞察（含详情页模板）
- 联系我们
- 中英文切换
- MySQL 数据存储
- 后端 API
- 联系表单提交
- 基础 SEO 与一级页面预渲染
- PC 和移动端适配
- 部署上线

内容通过数据库初始化数据进行维护，暂不开发完整管理后台。

### 第二阶段：后台管理

- 管理员登录
- 产品管理
- 解决方案管理
- 文章管理
- 企业介绍管理
- 中英文内容管理
- 客户留言管理
- 图片资源管理
- 网站配置管理

---

## 10. 验收标准

1. 所有一级导航可以正常访问。
2. 中英文切换正常，内容完整。
3. 产品和业务数据正确展示。
4. 所有详情页面可以正常访问。
5. 联系表单可以提交并保存至 MySQL。
6. 异常输入能够正确处理。
7. PC 和移动端布局正常。
8. 页面不存在明显错位、溢出和交互故障。
9. 核心页面具备 SEO 基础配置。
10. 后端能够通过 dotnet build。
11. 前端能够通过 npm run build。
12. 核心接口和业务流程测试通过。

---

## 11. 项目约束

- 不虚构企业客户、合作伙伴、荣誉资质及业务数据。
- 不把规划中的产品描述为已上线产品。
- 不擅自改变既定技术架构。
- 不在没有确认的情况下引入复杂第三方依赖。
- 每个功能独立开发、测试、验收。
- 每次重要修改同步更新相关文档。
- 设计稿与本 PRD 冲突时，以本 PRD 和第 12 章实施基线为准。

---

## 12. 设计稿实施基线（V1）

Pixso 设计稿定义布局、视觉与交互，但其中部分内容属于未确认的示例数据，或超出 V1 范围。以下规则已由项目负责人确认，开发时直接执行，无需逐条询问。

### 12.1 未确认的事实性内容一律替换

V1 不得展示任何未经确认的客户数量、合作伙伴与客户 Logo、营收或合同额、专利数量、员工规模、成立年份、客户满意度、SLA 与性能指标、认证资质、融资信息、调研数据、管理团队人员和办公地址。

处理方式：保留设计稿的版式、卡片数量和位置，把数字与事实替换为非事实性的能力表述。若去掉数字后卡片结构失衡，可把该区块改为“能力卡”（标题 + 一句话描述），栅格与卡片数量保持不变，不新增任何具体数值。

| 设计稿内容 | V1 展示 |
|---|---|
| 120+ 企业客户 | Enterprise Intelligence |
| 40亿+ / 99.98% SLA | Reliable AI Architecture |
| 46 项专利 | Engineering Innovation |
| 680+ 员工 | Research & Engineering |
| SOC 2 / ISO 27001 / 等保三级 | Security by Design |
| 68% / 14 周 / 8.4 倍 / 72% 效率提升 | Intelligent Workflow Optimization |
| 成立于 2016 年 / 2016—2026 时间轴 | 不展示，改为使命、愿景、价值观、技术理念 |
| 四位管理团队成员 | 不展示，改为不出现人名与照片的团队描述 |
| 12ms / 500+ / 98.7% / 180+ 评测基准 | 不展示具体数值，改为能力描述 |
| 上海 / 新加坡 / 伦敦 / 硅谷办公室 | 不展示，仅保留企业邮箱与表单入口 |

### 12.2 设计稿未覆盖的部分

- Home 的 Industries We Serve 区块：按 4.1 实现，复用解决方案卡片视觉语言。
- 产品、解决方案、文章详情页：设计稿只有总览页，由 Agent 用同一设计语言实现统一详情模板，不发明新风格。
- 平板、移动端与英文版：设计稿只有桌面中文稿，由 Agent 按 1440 桌面稿适配并验证 768 和 390 两个视口；英文文案按中文语义翻译，长度差异需重新排版。
- Contact 页 Footer 在设计稿中重复出现两次，实现时只保留一次。

### 12.3 超出 V1 范围的入口

- Products 的“下载白皮书 / 查看产品文档”：无对应资源与接口，不实现。
- Solutions 的行业筛选按钮：数据库无解决方案—行业关联，改为锚点跳转或移除。
- Insights 的“客户案例”分类：PRD 未定义，不出现。

### 12.4 产品成熟度

五大产品 V1 默认按 PLANNED 展示“规划中”标签，只有项目负责人确认后才可改为 IN_DEVELOPMENT 或 RELEASED。

**文档状态：V1.1 开发基线，已与 ARCHITECTURE / DATABASE / API 对齐，可交付 Agent 分阶段开发。**
