# VERINEX API 接口设计文档

> 项目：VERINEX TECHNOLOGIES 官方网站  
> 文档：API.md  
> 版本：V1.1  
> API Base Path：`/api/v1`  
> 后端：ASP.NET Core 10 Web API  
> 数据库：MySQL  
> 状态：开发基线，已与 PRD V1.1、DATABASE V1.1 对齐

## 1. 设计目标与约定

本 API 为 VERINEX 官网前端提供企业介绍、解决方案、产品、技术能力、行业、文章和联系表单能力。

约定：

- RESTful 资源路径。
- API 版本前缀统一为 `/api/v1`。
- JSON 使用 camelCase。
- 成功响应使用 `data` 包装；分页响应同时提供 `meta`。
- 错误响应采用 ASP.NET Core `ProblemDetails`。
- 公开内容接口只返回已发布且有对应语言翻译的数据。
- MVP 公开写接口仅有联系表单。
- 所有请求和响应均使用 UTF-8。

## 2. 基础地址与语言

本地开发示例：

```text
http://localhost:5000/api/v1
```

生产环境建议通过同源 Nginx 代理：

```text
https://<official-domain>/api/v1
```

### 2.1 语言参数

内容接口使用查询参数：

- `lang=zh-CN`
- `lang=en`

默认语言：`zh-CN`。

优先级：显式 `lang` > 已约定的请求语言头 > 默认 `zh-CN`。如果 `lang` 不属于支持范围，返回 400。

如果目标语言翻译不存在或未发布，详情接口返回 404；列表接口只返回存在目标语言已发布翻译的记录。不得静默回退为另一语言正文。

## 3. 通用响应规范

### 3.1 单资源成功

HTTP 200：

```json
{
  "data": {
    "id": 12,
    "slug": "enterprise-ai",
    "title": "Enterprise AI Solutions"
  }
}
```

### 3.2 列表成功

HTTP 200：

```json
{
  "data": [
    {
      "id": 12,
      "slug": "enterprise-ai",
      "title": "Enterprise AI Solutions"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "totalCount": 24,
    "totalPages": 3
  }
}
```

不分页的短列表可以只返回 `data`，但同一接口必须保持结构稳定。

### 3.3 错误响应

采用 ProblemDetails：

```json
{
  "type": "https://www.rfc-editor.org/rfc/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "detail": "The request contains invalid fields.",
  "instance": "/api/v1/contact",
  "errors": {
    "email": ["A valid email address is required."]
  },
  "traceId": "00-example"
}
```

不得在错误响应中包含堆栈、SQL、数据库连接字符串或内部密钥。

## 4. HTTP 状态码

| 状态码 | 使用场景 |
|---|---|
| 200 | 查询成功或常规成功 |
| 201 | 联系留言已创建并持久化 |
| 400 | 参数或请求体验证失败 |
| 404 | 资源或指定语言内容不存在 |
| 405 | HTTP 方法不支持 |
| 413 | 请求体超过限制 |
| 415 | Content-Type 不支持 |
| 429 | 请求频率超限 |
| 500 | 未预期服务端错误 |
| 503 | 服务暂时不可用，例如必要依赖不可用 |

## 5. 公开只读接口

### 5.1 首页聚合数据

```http
GET /api/v1/site/overview?lang=zh-CN
```

用途：获取首页需要的企业简介摘要、精选业务、精选产品、技术亮点、精选行业和精选文章。

响应字段建议：

```json
{
  "data": {
    "company": {
      "brandName": "VERINEX",
      "companyName": "VERINEX TECHNOLOGIES",
      "tagline": "Intelligence Built on Trust.",
      "overview": "..."
    },
    "featuredSolutions": [],
    "featuredProducts": [],
    "technologyHighlights": [],
    "featuredIndustries": [],
    "featuredInsights": []
  }
}
```

只返回已发布且有目标语言翻译的数据。首页区块顺序由设计和内容配置决定，不得在 API 中返回未审核的演示指标。

### 5.2 企业介绍

```http
GET /api/v1/company?lang=zh-CN
```

用途：获取公司介绍、使命、愿景、价值观和 SEO 信息。

Response DTO：

- `brandName`
- `companyName`
- `tagline`
- `overview`
- `mission`
- `vision`
- `values`
- `seoTitle`
- `seoDescription`

### 5.3 解决方案列表

```http
GET /api/v1/solutions?lang=zh-CN
```

用途：获取五大业务解决方案列表。

可选参数：

- `featured=true|false`

返回字段：

- `id`
- `code`
- `slug`
- `title`
- `subtitle`
- `summary`
- `sortOrder`

列表按 `sortOrder`、`id` 稳定排序。

V1 不支持按行业筛选解决方案：数据库没有解决方案—行业关联表，前端不使用 `industry` 参数。

### 5.4 解决方案详情

```http
GET /api/v1/solutions/{slug}?lang=zh-CN
```

返回字段：

- `id`
- `code`
- `slug`
- `title`
- `subtitle`
- `summary`
- `body`
- `seoTitle`
- `seoDescription`

仅返回 PUBLISHED 内容。

### 5.5 产品列表

```http
GET /api/v1/products?lang=zh-CN
```

可选参数：

- `featured=true|false`
- `stage=PLANNED|IN_DEVELOPMENT|RELEASED`

返回字段：

- `id`
- `code`
- `slug`
- `name`
- `subtitle`
- `summary`
- `productStage`
- `coverImage`
- `sortOrder`

注意：`contentStatus` 控制网页内容是否公开；`productStage` 说明产品真实成熟度。不得把 PLANNED 或 IN_DEVELOPMENT 显示成已发布产品。

`coverImage` 为图片 URL 字符串，直接取自 `products.cover_image_url`；无封面时返回 `null`，字段始终存在，前端不得依赖字段缺失判断。

### 5.6 产品详情

```http
GET /api/v1/products/{slug}?lang=zh-CN
```

返回字段：

- `id`
- `code`
- `slug`
- `name`
- `subtitle`
- `summary`
- `description`
- `features`
- `productStage`
- `coverImage`
- `seoTitle`
- `seoDescription`

### 5.7 技术能力

```http
GET /api/v1/technologies?lang=zh-CN
```

返回已发布的技术能力列表，建议字段：

- `id`
- `code`
- `title`
- `summary`
- `description`
- `sortOrder`

初始技术方向可包括 LLM、RAG、AI Agents、Knowledge Graph、Data Engineering、Multimodal AI、Intelligent Automation 和 Enterprise AI Integration，与 PRD 4.5 一致。实际展示内容须与公司真实能力和项目负责人确认的信息一致。

### 5.8 行业列表

```http
GET /api/v1/industries?lang=zh-CN
```

返回已发布行业及其介绍：

- `id`
- `code`
- `title`
- `summary`
- `description`
- `sortOrder`

### 5.9 文章列表

```http
GET /api/v1/insights?lang=zh-CN&page=1&pageSize=10
```

可选参数：

- `category`：文章分类编码。
- `featured=true|false`。
- `page`：默认 1，最小 1。
- `pageSize`：默认 10，最大 50。

返回字段：

- `id`
- `slug`
- `title`
- `excerpt`
- `categoryCode`
- `coverImage`
- `publishedAt`
- `isFeatured`

排序：优先按 `publishedAt DESC`，再按 `id DESC`，保证分页稳定。

`coverImage` 为图片 URL 字符串，取自 `articles.cover_image_url`，无封面返回 `null`。

### 5.10 文章详情

```http
GET /api/v1/insights/{slug}?lang=zh-CN
```

返回字段：

- `id`
- `slug`
- `title`
- `excerpt`
- `categoryCode`
- `content`
- `coverImage`
- `publishedAt`
- `seoTitle`
- `seoDescription`
- `relatedArticles`

文章正文若使用 Markdown，服务端或前端渲染时必须进行安全处理，禁止未经净化直接输出任意 HTML。

`relatedArticles` 为 V1 计算字段，不引入关联表。规则固定为：

1. 取同一 `categoryCode` 下已发布的其他文章；
2. 按 `publishedAt DESC` 排序，取最多 3 条；
3. 不足 3 条时用最近发布的其他已发布文章补齐；
4. 每条只返回 `slug`、`title`、`excerpt`、`coverImage`、`publishedAt`。

### 5.11 公开站点配置

```http
GET /api/v1/site/settings?lang=zh-CN
```

用途：获取联系邮箱、社交链接、备案信息等站点级公开配置，避免前端硬编码。

返回：

```json
{
  "data": {
    "contactEmail": "business@verinex.ai",
    "socialLinks": [],
    "icpNumber": ""
  }
}
```

只返回 `site_settings.is_public = 1` 的配置；缺少的键返回 `null` 或空数组，字段结构保持稳定。不得返回密钥、内部开关或任何非公开配置。隐私政策当前版本（`privacyPolicyVersion`）由此接口返回，服务端校验提交值时以数据库中的当前值为准，不信任客户端传入值。

## 6. 联系表单接口

### 6.1 提交留言

```http
POST /api/v1/contact
Content-Type: application/json
```

Request：

```json
{
  "name": "Alex Zhang",
  "companyName": "Example Technology Co.",
  "email": "alex@example.com",
  "phone": "+1-555-0100",
  "industry": "manufacturing",
  "cooperationType": "enterprise-ai",
  "targetProduct": "verimind",
  "message": "We would like to learn more about your enterprise AI solutions.",
  "locale": "en",
  "privacyConsent": true,
  "privacyPolicyVersion": "1.0"
}
```

字段规则：

| 字段 | 必填 | 规则 |
|---|---|---|
| name | 是 | 去除首尾空格，1–100 字符 |
| companyName | 是 | 去除首尾空格，1–160 字符 |
| email | 是 | 合法邮箱，最长 254 字符 |
| phone | 否 | 最长 40 字符，按业务需要验证格式 |
| industry | 否 | 必须属于 `industries` 中已发布行业的 code |
| cooperationType | 是 | 必须属于允许的合作方向编码或白名单 |
| targetProduct | 否 | 必须是已发布产品的 code 或 `unsure` |
| message | 是 | 1–5000 字符 |
| locale | 是 | `zh-CN` 或 `en` |
| privacyConsent | 是 | 必须为 true |
| privacyPolicyVersion | 是 | 必须等于服务端当前有效版本（取自 site_settings） |

成功响应：HTTP 201 Created。

```json
{
  "data": {
    "message": "Your inquiry has been received. Thank you for contacting VERINEX."
  }
}
```

中文页面返回对应中文提示。

处理规则：

1. 服务端再次验证所有字段，不能只依赖前端校验。
2. 检查隐私同意和政策版本。
3. 执行长度限制、频率限制和反垃圾校验。
4. 将留言保存至 `contact_messages`。
5. 保存成功后再尝试触发邮件通知（如果已配置）。
6. 邮件失败不能回滚或丢弃已保存留言，应记录不含敏感正文的错误日志。
7. 返回成功响应时，表示留言已持久化，不代表商务人员已经回复。

MVP 不开放公开的留言查询、修改或删除接口。

## 7. 健康检查接口

```http
GET /health/live
GET /health/ready
```

- `live`：进程是否存活。
- `ready`：应用是否具备接收流量的条件；如数据库是必需依赖，应检查数据库连接。

健康检查不得泄露连接字符串、服务器内部地址或敏感诊断信息。

## 7.1 站点地图

```http
GET /sitemap.xml
```

- 采用 `application/xml`，遵循 sitemaps.org 0.9 协议。
- 仅包含已发布且有对应语言翻译的内容：一级页面（zh / en）、解决方案详情、产品详情、文章详情。
- 地址前缀取自配置 `Site:PublicBaseUrl`（环境变量 `Site__PublicBaseUrl`）；未配置时使用当前请求的 scheme + host。
- 不包含任何草稿、未发布内容或客户留言等非公开数据。
- 由 Nginx 将 `/sitemap.xml` 反向代理到 API（见 `frontend/docker/nginx.conf`），与前端同域发布。

## 8. 分页与排序规范

分页参数：

- `page`：从 1 开始，默认 1。
- `pageSize`：默认 10，最大 50。

分页元数据：

```json
{
  "page": 1,
  "pageSize": 10,
  "totalCount": 35,
  "totalPages": 4
}
```

无效分页参数返回 400，或按统一规则规范化；整个项目必须使用同一规则。列表排序必须稳定，避免翻页时数据重复或遗漏。

## 9. 缓存策略

- 公司、产品、解决方案、技术、行业等公开 GET 数据可设置短期缓存或 ETag。
- 文章列表和详情可设置合理缓存；内容更新后应能失效或更新版本。
- 联系表单 POST 不缓存。
- 不缓存含客户个人信息的响应。
- 不得因为缓存导致不同语言返回错误内容；缓存键必须包含语言和相关查询参数。

## 10. CORS 与反向代理

生产环境优先使用同源部署：Nginx 提供前端资源并将 `/api` 转发到 ASP.NET Core，因此不需要宽泛开放跨域。

开发环境只允许明确的本地前端源，例如 `http://localhost:5173`。禁止 `AllowAnyOrigin` 与凭据同时使用。若经过 Nginx，只有明确配置的可信代理才能提供转发头。

## 11. OpenAPI 文档要求

每个接口必须有：

- Summary / Description。
- Request DTO 和字段约束。
- Response DTO。
- 成功和错误状态码。
- 语言参数说明。
- 分页参数说明（如适用）。

OpenAPI 应与代码同步生成，不得维护一份长期过期的手写接口清单。

## 12. API 版本与兼容性

- V1 路径固定为 `/api/v1`。
- 不得在不通知前端的情况下改变字段含义、类型或必填性。
- 破坏性接口变更必须先更新本文和前端调用，并经项目负责人确认。
- 新增可选字段通常可保持向后兼容，但仍需更新 DTO 和文档。

## 13. MVP 不包含的接口

除非 PRD 后续明确增加，MVP 不实现：

- 管理员登录、注册、权限管理。
- 产品、解决方案和文章的公开写接口。
- 后台 CRUD API。
- 访客注册或用户中心。
- AI 对话、Agent 执行或产品控制台接口。
- 文件上传接口。
- 白皮书、产品文档等文件下载接口。

这些能力属于后续阶段，应在对应 PRD、数据库和安全方案确认后设计。

**文档结束**
