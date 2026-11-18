# design — 视觉基准资料

## 目录

```text
design/
├── source/
│   └── verinex-all-pages.svg     # Pixso 全页源文件（约 44MB，7 个页面横向拼接）
└── reference/
    ├── about.png                 # /zh/about
    ├── solutions.png             # /zh/solutions
    ├── products.png              # /zh/products
    ├── technology.png            # /zh/technology
    ├── insights.png              # /zh/insights
    └── contact.png               # /zh/contact
```

## 使用约定

1. 逐页开发时读取 `reference/` 下对应 PNG，不要解析 `source/` 中的整份 SVG——文件过大，且与 PNG 内容重复。
2. 首页没有独立 PNG，其视觉取自 `source/verinex-all-pages.svg` 的第一个页面片段；如需截图，按 1440 宽度单独导出为 `reference/home.png` 后提交。
3. 设计稿只覆盖桌面中文稿。平板、移动端和英文版按 `docs/PRD.md` 第 12.2 节由 Agent 适配，不自行发明布局。
4. 设计稿中的企业数据、认证、团队、地址等未确认信息，按 `docs/PRD.md` 第 12 章替换，不得原样上线。
5. 本目录只放设计资料，不放前端代码资源；切图、字体、图标等实际使用素材放入 `frontend/src/assets/`。


## 2026-11-18 深色视觉升级

本次对话明确授权 Premium Dark AI Technology + Elegant Corporate Design，
替代原蓝白配色；原 Pixso 继续作为页面模块、品牌素材和内容结构参考。
业务内容、API、路由、双语和产品成熟度规则保持原基线。

- 统一变量：frontend/src/styles/_tokens.scss；页面表面与卡片表面分离，渐变边缘统一回到 #070D18。
- 内容宽度：最大 1400px，额外计算自适应左右边距；顶部信息栏 36px、主导航 88px，手机导航 64px。
- 卡片：20px 圆角、低对比边框；产品图标采用五种低饱和强调色；保留 PLANNED 标签。
- 字体：Inter / Space Grotesk / HarmonyOS Sans SC / Noto Sans SC 优先，系统字体回退；没有新增外部字体请求或字体文件。
- 动效：保留 SVG 几何缓动，增加节点呼吸与渐入增强；系统减少动态效果时禁用。
- 验证：Playwright 配置覆盖 1920、1440、768、390；截图位于 frontend/output/playwright/。
- 构建：使用本机 Node 24.15；保留旧构建产物（emptyOutDir: false），预渲染可在已有路由目录下重复执行。

## 第二轮 Premium Dark Editorial（Phase 2 / Phase 3）

负责人已授权继续完成全部七页，并将默认入口改为英文。本轮规范见 `docs/DESIGN_SPEC.md`，优先于上一节的旧视觉参数。

- `now/`：第二轮开始前的真实页面截图，原文件保留。
- `phase2/assets-source/`：首页品牌主视觉、五产品符号和首篇文章封面；提示词见同级 `asset-prompts.json`。
- `phase3/assets-source/`：知识治理、RAG 评估、人工审核文章封面；提示词见同级 `asset-prompts.json`。
- 实际网页资产位于 `frontend/public/media/editorial-v2/`，由 `frontend/scripts/prepare-editorial-assets.mjs` 编码为 WebP。
- 第二轮改为 1360px 内容容器与 80px 单行导航；七页分别使用独立构图，详情页使用纯排版 Hero。
- 所有原始设计图、原始素材和旧截图均保留。本次未执行递归删除。
