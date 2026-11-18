# VERINEX 开发交接流程（V1.1 基线）

> 面向对象：项目负责人（你）和执行开发的 AI Agent。
> 用法：一个阶段一个新会话，复制对应提示词全文粘贴；上一阶段验收通过并 commit 后，才进入下一阶段。

## 0. 使用规则

1. **一个阶段一个新会话。** 提示词已自带完整上下文，不需要你再解释项目背景。
2. **验收后再 commit。** Agent 按规范不会自动 commit；每阶段你亲自验收后提交一次，commit message 写明阶段编号。
3. **Agent 中途提问时**：如果答案会改变 PRD / API / DATABASE 的契约，先改文档再让它继续；如果只是实现细节，直接回答。
4. **Agent 输出与 AGENTS.md 冲突时**，要求它按 AGENTS.md 重做，不要迁就。
5. 阶段切得少，单个会话就大——**阶段 3 尤其重**，提示词里已要求 Agent 内部逐页自查，你验收时也要逐页点开看，别只看它的汇报。

## 1. 阶段总览

| 阶段 | 内容 | 产出 | 验收门禁 |
|---|---|---|---|
| 1 | 工程与布局骨架 | 前后端空壳、Provider 验证、Design Tokens、Docker Compose、Header/Footer/双语路由/响应式断点 | 双端 build 通过；compose 可启动；三视口截图无溢出、Footer 单次 |
| 2 | 数据库与后端 | 全部 MVP 实体、Migration、Seed、公开 API、联系接口、测试 | dotnet test 全绿；curl 逐接口验证 |
| 3 | 前端页面与集成 | 七个页面 + 三类详情模板、接通 API、联系表单全链路、SEO | 逐页与 PNG 对照；表单落库可查；view-source 首屏含真实内容 |
| 4 | 测试与部署 | 全量构建/测试、Compose 完整编排、部署说明 | PRD 第 10 章验收标准逐条通过 |

人工确认点只有三处：阶段 1 的 Provider 版本、阶段 2 的 Seed 文案与隐私政策版本号、阶段 4 之后的上线发布。

## 2. 阶段 1 · 工程与布局骨架

```text
现在开始 VERINEX 官网开发。本阶段完成工程初始化与全站布局骨架，不建业务表、不写后端接口、不做业务页面。

严格遵循仓库根目录 AGENTS.md。先完整阅读 docs/PRD.md（重点第 12 章设计稿实施基线）、docs/ARCHITECTURE.md、docs/DATABASE.md、docs/API.md、design/README.md。

任务：
1. 初始化 frontend/：Vue 3 + TypeScript + Vite + Vue Router + Pinia + Vue I18n + Axios + SCSS；目录结构按 ARCHITECTURE.md 第 6 章。
2. 初始化 backend/：ASP.NET Core 10 Web API + xUnit，含 UnitTests / IntegrationTests 两个测试项目；目录结构按第 7 章。
3. 验证并锁定 MySQL EF Core Provider 与 EF Core 10 兼容的具体版本，结论（背景/决策/备选/影响）写入 docs/ADR-001-mysql-provider.md。这是唯一允许本阶段新增的文档。
4. 搭建 docker-compose.yml：web（Nginx）、api、mysql 三服务，能 docker compose up 启动空壳；MySQL 端口不暴露公网。
5. 从 design/reference/ 六张 PNG 和 design/source/verinex-all-pages.svg 的首页片段提取 Design Tokens（品牌色/字体/字号/间距/圆角/断点），写入 frontend/src/styles/；不要整份解析 44MB 的 SVG。
6. Header：Logo、七项一级导航、中英文切换、Contact Us 按钮，移动端汉堡菜单。
7. Footer：以 contact.png 为准，只实现一次（设计稿中重复出现两次，按 PRD 12.2 只保留一次）；加通用 CTA 组件。
8. /zh 与 /en 双语路由骨架：语言前缀、切换时映射到同一页面的另一语言、hreflang；固定 UI 文案全部进 Vue I18n，不留硬编码。
9. 响应式断点 1440 / 768 / 390，平板与移动端按 PRD 12.2 由你适配，不得简单缩小桌面布局。
10. 首页 Hero 静态版：主标题 Intelligence Built on Trust.，副标题与两个按钮。

禁止：修改 docs 契约、commit、push。

验收方式：npm run build 与 dotnet build 通过；Playwright 在 1440 / 768 / 390 三视口截图自查导航、Footer、无横向溢出；按 AGENTS.md 第 14 章模板汇报。
```

## 3. 阶段 2 · 数据库与后端

```text
继续 VERINEX 官网开发，本阶段实现数据库与全部后端 API，不做前端页面。

严格遵循 AGENTS.md，以 docs/DATABASE.md 与 docs/API.md（均为 V1.1）为唯一契约。

任务：
1. 按 DATABASE.md 实现 MVP 实体与 Fluent Configuration：company/solution/product/technology/industry/article 各主表+翻译表、contact_messages、site_settings。不创建 media_assets（第二阶段），封面用 cover_image_url。
2. 创建 Migration；编写幂等 Seed：五大业务、五大产品（默认 PLANNED）、技术能力、行业、至少 3 篇标记为示例的文章、site_settings（contact_email / privacy_policy_version / icp_number / social_links）。所有文案内容按 PRD 第 12 章替换表撰写，不得出现设计稿中未确认的数字与资质；中英文语义一致。
3. 按 API.md 实现全部公开只读接口（含 site/overview 的 featuredIndustries、5.11 site/settings）与 POST /contact：服务端验证全部字段、ProblemDetails 错误、频率限制、privacy_policy_version 以 site_settings 当前值为准，不信任客户端。
4. 测试：xUnit Service 单元测试 + WebApplicationFactory 集成测试，覆盖：字段验证失败返回 400、未发布内容不可见、目标语言缺失时列表不回退、relatedArticles 计算规则（同分类+时间倒序+最多3条+最新补齐）、留言成功持久化、留言重复/频繁提交被限流。

验收方式：dotnet build、dotnet test 全部通过并附输出；docker compose 启动后用 curl 逐个验证接口返回。
```

## 4. 阶段 3 · 前端页面与集成

```text
继续 VERINEX 官网开发，本阶段完成全部前端页面、接通 API、联系表单与 SEO。这是最重的阶段，内部必须逐页推进、逐页自查。

严格遵循 AGENTS.md。页面顺序：Home → About → Solutions（含详情模板）→ Products（含详情模板）→ Technology → Insights（含详情模板）→ Contact。

要求：
1. 视觉对照 design/reference/ 对应 PNG（首页参考 design/source 中首页片段），从 Design Tokens 取值，不自行发挥。
2. 设计稿中未确认的客户数、指标、认证、团队、办公室等内容一律按 PRD 第 12 章替换表处理，版式保留。
3. 详情页按 PRD 12.2 用同一设计语言实现统一模板；Home 的 Industries We Serve 区块按 PRD 4.1 实现并复用解决方案卡片视觉。
4. 所有列表/详情接 API：实现 loading、empty、error、retry 状态；请求带 lang 参数。
5. 联系表单：按 PRD 4.7 的 9 字段实现（公司名必填、需求描述必填，行业/意向产品为下拉选填），前端验证 + POST /api/v1/contact，完整呈现成功、失败、限流状态；提交后验证 MySQL 落库。
6. SEO：七个一级页面与 /zh /en 首页构建期预渲染为独立 HTML；详情页客户端渲染并输出 title/description/canonical/hreflang/Open Graph；后端提供 sitemap.xml；robots.txt 随前端发布；主要业务与产品页加结构化数据。
7. 每完成一页：npm run build + Playwright 三视口截图自查通过后再进入下一页；全部完成后统一按 AGENTS.md 第 14 章模板汇报，汇报中逐页列出截图与验证结果。

禁止：不实现白皮书下载入口、解决方案行业筛选、客户案例分类（PRD 12.3）；不擅自更换前端框架；若预渲染插件与现有依赖冲突，记录问题并给降级方案，等待确认。
```

## 5. 阶段 4 · 测试与部署

```text
继续 VERINEX 官网开发，本阶段完成全量测试与部署编排，不改功能。

任务：
1. 前端：TypeScript 类型检查、npm run build、Playwright 测试（导航、语言切换、联系表单成功与失败路径、1440/768/390 视口截图对照设计稿）。
2. 后端：dotnet build、dotnet test，全部通过。
3. Docker Compose 完整编排：Nginx 同源代理 /api、MySQL 持久化卷、健康检查；本地完整启动验证一次全流程。
4. 编写 README.md：本地启动、环境变量清单（不含真实密钥）、部署步骤、备份说明。
5. 对照 PRD 第 10 章验收标准逐条自查并给出结论。

禁止：未经我确认执行任何生产部署、迁移或 push。
```

## 6. 验收后你要做的事

- 检查 Agent 汇报里的验证结果是「实际执行」还是「未执行」，未执行的项目要求补跑。
- 自己 commit：`git add -A && git commit -m "stage N: <阶段名>"`。
- 上线（阶段 4 之后）属于独立事项：先备份数据库，再人工确认后发布。
