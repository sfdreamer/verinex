/**
 * 简体中文固定 UI 文案。所有页面可见文案必须在此登记，
 * 组件内不得硬编码中英文（见 docs/ARCHITECTURE.md 6.3）。
 * 数据库内容（公司介绍、产品、文章等）不属于本文件，由 API 提供。
 */
const zhCN = {
  editorial: {
    solutionSecondaryNames: {
      "data-intelligence": "Data Intelligence",
      "enterprise-ai": "Enterprise AI Solutions",
      "brand-intelligence": "Brand Intelligence",
      "ai-content": "AI Content Solutions",
      "research-insights": "Data Research & Insights"
} as Record<string, string>,
    capabilitiesTitle: '四个领域，一条清晰的技术路径。',
    "aboutTitle": "以真实为起点。\n让智能值得信赖。",
    "purpose": "使命与愿景",
    "solutionsTitle": "连接数据、知识\n与业务的下一步。",
    "productsTitle": "各有所长，\n共赴智能未来。",
    "technologyTitle": "清晰的架构。\n可信的智能。",
    "engineering": "工程理念",
    "engineeringBody": "从数据来源到模型输出，以可追溯、可解释与可治理为设计原则。在真实业务边界内验证技术，以清晰的系统职责、持续评估和人工审核规划企业 AI 的实现路径。",
    "insightsTitle": "观察。研究。\n新的可能。",
    "contactTitle": "从您的业务问题，\n开始一次对话。",
    "flow": [
        "数据",
        "知识",
        "智能应用"
    ],
    "domains": [
        "数据与知识工程",
        "模型与多模态",
        "智能体与自动化",
        "企业系统集成"
    ],
    "domainDescriptions": [
        "组织数据与知识，让检索和生成有据可循。",
        "探索大模型选型、推理与多模态信息理解。",
        "将任务规划与人工审核纳入智能工作流。",
        "围绕权限、流程和系统边界规划企业 AI。"
    ]
},
  meta: {
    siteName: 'VERINEX TECHNOLOGIES',
  },
  brand: {
    name: 'VERINEX',
    technologies: 'TECHNOLOGIES',
    chinese: '维真科技',
    slogan: '以可信为基，以智能致远。',
  },
  nav: {
    home: '首页',
    about: '关于我们',
    solutions: '解决方案',
    products: '产品',
    technology: '技术',
    insights: '洞察',
    contact: '联系我们',
  },
  actions: {
    contactUs: '商务合作',
    exploreSolutions: '探索解决方案',
    discoverProducts: '了解产品',
    bookDemo: '预约演示',
    contactSales: '联系销售团队',
    learnMore: '了解更多',
  },
  header: {
    utility: 'VERINEX TECHNOLOGIES · 维真科技',
    badge: '可信 AI',
    tagline: '以可信为基，以智能致远。',
    openMenu: '打开导航菜单',
    closeMenu: '关闭导航菜单',
    language: '切换语言',
  },
  footer: {
    description:
      '探索数据、知识与企业智能的更多可能。',
    columns: {
      solutions: '解决方案',
      products: '产品',
      company: '公司',
      contact: '联系',
    },
    solutions: {
      dataIntelligence: '数据智能',
      enterpriseAi: '企业 AI',
      brandIntelligence: '品牌智能',
      aiContent: 'AI 内容',
      dataResearch: '数据研究与洞察',
    },
    company: {
      about: '关于我们',
      technology: '技术实力',
      insights: '洞察',
      contact: '联系我们',
    },
    contact: {
      emailLabel: '商务合作',
      cta: '发起合作咨询',
    },
    legal: {
      privacy: '隐私政策',
    },
    rights: '© {year} VERINEX TECHNOLOGIES 维真科技 保留所有权利',
  },
  cta: {
    eyebrow: '商务合作',
    title: '让可信的智能，\n从一次对话开始。',
    subtitle: '聊聊您的业务场景，一起探索数据与 AI 的应用方向。',
    primary: '洽谈合作',
    secondary: '联系销售团队',
  },
  home: {
    hero: {
      eyebrow: 'VERINEX · 企业智能',
      title: '以可信为基，以智能致远。',
      lineOne: '以可信为基，',
      lineTwo: '以智能致远。',
      scroll: '探索 VERINEX',
      subtitle: '将数据转化为智能，赋能企业未来。',
      note: '数据智能 · 企业 AI 平台 · AI 品牌智能 · 内容智能 · 行业研究',
      // PRD 12.1：设计稿中的 120+/40亿+/99.98% 等未确认指标，替换为能力表述
      capabilities: ['企业智能', '可靠 AI 架构', '工程创新', '安全设计'],
    },
    about: {
      eyebrow: '关于 VERINEX',
      title: '让数据与 AI 能力以可靠、可治理的方式服务真实业务。',
      link: '了解 VERINEX',
    },
    solutions: {
      eyebrow: '核心业务',
      title: '从业务问题，\n找到智能路径。',
      lead: '五大业务方向，连接数据、知识与企业应用。',
      viewAll: '探索全部解决方案',
      cardCta: '了解详情',
      customCard: {
        title: '需要定制化的行业智能方案？',
        body: '告诉我们您的业务场景，我们一起梳理可行的智能化路径。',
        cta: '预约方案咨询',
      },
    },
    products: {
      eyebrow: '产品生态',
      title: '五个产品方向。\n一个智能愿景。',
      lead: '围绕企业数据、智能应用与品牌内容，规划五个各有专注的产品平台。',
      viewAll: '浏览全部产品',
      cardCta: '了解产品',
    },
    technology: {
      eyebrow: '技术实力',
      title: '让智能有据可循。',
      lead: '从数据工程到多模态 AI，探索可追溯、可治理的企业智能技术路径。',
      viewAll: '了解技术方向',
      // PRD 12.1：替换设计稿中的 46% / 12ms / SOC 2 指标为能力表述
      pillars: ['工程创新', '可靠 AI 架构', '安全设计'],
    },
    industries: {
      eyebrow: '关注的行业场景',
      title: '面向重点行业的智能化场景',
      lead: '以相同的可信技术底座，适配不同行业的数据与业务流程。',
    },
    perspectives: { eyebrow: '技术与洞察', title: '技术为基，洞察向前。' },
    insights: {
      eyebrow: '前沿洞察',
      title: '前沿洞察，与行业一同演进',
      viewAll: '查看全部洞察',
    },
  },
  about: {
    facts: {
      mission: '使命',
      vision: '愿景',
      values: '价值观',
    },
    hero: {
      eyebrow: 'ABOUT VERINEX',
      title: 'Built by engineers, defined by trust.',
      subtitle: '我们以可信为基，以智能致远',
      // PRD 12.1：替换设计稿中的成立年份 / 员工数 / 客户数指标行
      capabilities: ['企业智能', '可靠 AI 架构', '工程创新', '研究与工程'],
    },
    mission: {
      eyebrow: 'OUR MISSION',
      title: '让每一个智能决策，都能被验证与信任',
      visionLabel: '企业愿景',
      missionLabel: '企业使命',
      // PRD 12.1：替换设计稿中的 8 / 680 / 46 / 99.9% 指标
      pillars: ['可审计', '可解释', '可扩展', '可治理'],
    },
    values: {
      eyebrow: 'VALUES',
      title: '我们所坚持的四条原则',
      lead: '价值观不是口号，而是每一次技术选择与交付决策的判断标准。',
      // 卡片标题取自 API 的企业价值观（真实 / 专业 / 创新 / 责任）
      items: {
        真实: '以真实数据、真实能力与真实进展对外沟通，不夸大、不虚构。',
        专业: '以工程纪律与专业方法对待每一个技术细节与业务承诺。',
        创新: '在可信边界内持续探索大模型、智能体与数据智能的新可能。',
        责任: '对数据安全、算法影响与客户业务结果负责。',
      } as Record<string, string>,
    },
    philosophy: {
      eyebrow: 'OUR PHILOSOPHY',
      title: '技术理念：可信优先，工程为本',
      lead: '发展历程在真实资料确认前不展示。我们相信，企业级 AI 的价值来自可验证的工程实践。',
      items: [
        { title: '可审计', body: '每一次模型调用、数据流转与决策依据都可追溯、可复盘。' },
        { title: '可解释', body: '让企业理解 AI 的推理过程，而不是面对黑盒结果。' },
        { title: '可治理', body: '数据、知识、权限与流程在统一治理框架下运转。' },
        { title: '可扩展', body: '架构随业务规模平滑演进，不被单点技术绑定。' },
      ],
    },
    team: {
      eyebrow: 'OUR TEAM',
      title: '由研究者与工程师组成的团队',
      body: 'VERINEX 团队由长期关注企业智能化的一线研究者与工程师组成。在真实资料确认前，本页不展示具体成员信息。',
    },
  },
  productStage: {
    PLANNED: '规划中',
    IN_DEVELOPMENT: '开发中',
    RELEASED: '已发布',
  },
  solutionsPage: {
    hero: {
      eyebrow: 'SOLUTIONS',
      title: 'Five capabilities. One trusted intelligence stack.',
      subtitle: '五项核心业务，覆盖企业智能的完整链路',
      lead: '从数据基础到业务智能，VERINEX 以模块化方案支持企业按自身的节奏推进智能化，每一步都可度量、可验证。',
    },
    lines: {
      eyebrow: 'CORE BUSINESS LINES',
      title: '核心业务线',
      count: '{count} 项业务方向',
    },
    capabilitiesLabel: '核心能力',
    detailCta: '了解方案',
    process: {
      eyebrow: 'HOW WE WORK',
      title: '从诊断到上线的四步路径',
      steps: [
        {
          step: 'STEP 01',
          title: '诊断评估',
          body: '从业务目标与数据现状出发，明确可行的智能化切入点与优先级。',
        },
        {
          step: 'STEP 02',
          title: '方案设计',
          body: '结合场景与现有系统，设计数据、模型与流程的实施方案。',
        },
        {
          step: 'STEP 03',
          title: '联合验证',
          body: '以可度量的方式验证效果，并在真实业务中持续迭代调整。',
        },
        {
          step: 'STEP 04',
          title: '规模化上线',
          body: '完成治理、权限与运维准备，支持能力在组织内规模复制。',
        },
      ],
    },
  },
  // PRD 4.3 已确认的解决方案核心能力（按业务编码）
  solutionCapabilities: {
    'data-intelligence': ['数据采集与治理', '企业知识库', '知识图谱', '语料管理'],
    'enterprise-ai': ['大模型应用', 'RAG 系统', 'AI Agent', '智能工作流', '私有化部署'],
    'brand-intelligence': ['GEO', 'AI 品牌认知分析', 'AI 搜索可见度监测', '品牌语义优化'],
    'ai-content': ['AI 内容生成', '多模态内容处理', '内容管理', '内容质量审核'],
    'research-insights': ['行业研究', '市场分析', '消费者偏好研究', '数据可视化'],
  } as Record<string, string[]>,
  solutionScenarios: {
    'data-intelligence': [
      '多源业务数据的统一治理与质量提升',
      '跨部门知识检索与知识资产管理',
      '面向大模型的语料准备与版本管理',
    ],
    'enterprise-ai': [
      '企业知识问答与检索增强应用',
      '跨系统业务流程的智能体编排',
      '对数据合规要求较高的私有化部署场景',
    ],
    'brand-intelligence': [
      '生成式搜索环境下的品牌内容策略',
      '品牌语义资产的结构化梳理',
      '品牌认知的持续监测与分析框架',
    ],
    'ai-content': [
      '多形态营销内容的规模化生产',
      '内容审核与质量治理流程',
      '内容资产的统一管理与复用',
    ],
    'research-insights': [
      '行业与市场研究的结构化分析',
      '消费者偏好与需求洞察',
      '经营数据的可视化与报告输出',
    ],
  } as Record<string, string[]>,
  solutionDetail: {
    eyebrow: 'SOLUTION',
    capabilitiesTitle: '核心能力',
    scenariosEyebrow: 'SCENARIOS',
    scenariosTitle: '应用场景',
    scenariosNote: '以下为方案适用的典型场景，具体范围以项目评估结论为准。',
    contactTitle: '与我们一起规划这条路径',
    contactBody: '告诉我们您的业务目标与现状，我们会给出可执行的建设建议。',
    contactCta: '联系商务团队',
    relatedEyebrow: 'MORE SOLUTIONS',
    relatedTitle: '其他解决方案',
    backToList: '返回解决方案',
  },
  productsPage: {
    hero: {
      eyebrow: 'PRODUCT SUITE',
      title: 'One platform. Five interoperable products.',
      subtitle: '五大产品，一套可信的智能基础设施',
      lead: 'VERINEX 产品体系共享统一的数据模型、权限体系与交付框架，可单独启用，也可组合成企业级 AI 中枢。',
    },
    matrix: {
      eyebrow: 'PRODUCT MATRIX',
      title: '产品矩阵',
      note: '所有产品当前均为规划中，页面内容用于说明产品方向。',
    },
    detailCta: '产品详情',
    guide: {
      title: '不知道从哪个产品开始？',
      body: '告诉我们您的业务场景与数据现状，我们会一起判断适配的产品组合。',
      cta: '联系产品顾问',
    },
  },
  productDetail: {
    eyebrow: 'PRODUCT',
    featuresTitle: '核心能力',
    stageLabel: '产品状态',
    stageNotes: {
      PLANNED: '该产品目前处于规划阶段，页面内容用于说明产品方向，不代表已正式发布或完成交付。',
      IN_DEVELOPMENT: '该产品目前处于开发阶段，功能范围与上线时间以正式发布信息为准。',
      RELEASED: '该产品已发布，具体功能与交付范围以商务沟通结果为准。',
    },
    contactTitle: '讨论这个产品在您业务中的用法',
    contactBody: '我们可以结合您的数据与流程，说明产品能力边界与实施路径。',
    contactCta: '联系产品团队',
    relatedEyebrow: 'MORE PRODUCTS',
    relatedTitle: '其他产品',
    backToList: '返回产品中心',
  },
  technologyPage: {
    hero: {
      eyebrow: 'TECHNOLOGY',
      title: 'Trust architecture, engineered for scale.',
      subtitle: '可信架构，为规模化而设计',
      lead: '从数据底座到智能体编排，VERINEX 以统一的技术架构支持可审计、可解释、可治理的企业智能。',
      // PRD 12.1：设计稿此处的认证标识（SOC 2 / ISO 27001 / 等保三级）替换为能力表述
      chips: ['可审计', '可解释', '可治理', '安全设计'],
    },
    architecture: {
      eyebrow: 'ARCHITECTURE',
      title: '四层架构，一个可信的智能内核',
      lead: '每层职责清晰、彼此解耦，让模型能力在可控边界内进入业务系统。',
      // 技术能力按层组织，条目取自 /api/v1/technologies 已发布的八项技术方向
      layers: [
        {
          name: '应用与智能体层',
          en: 'Application & Agent Layer',
          body: '把模型能力封装为可治理的业务应用与智能体流程。',
          items: ['ai-agents', 'intelligent-automation', 'enterprise-ai-integration'],
        },
        {
          name: '模型与推理层',
          en: 'Model & Inference Layer',
          body: '关注模型选型、接入、评估与推理效率。',
          items: ['llm', 'multimodal-ai'],
        },
        {
          name: '知识与检索层',
          en: 'Knowledge & Retrieval Layer',
          body: '以可追溯的企业知识支撑检索与生成。',
          items: ['rag', 'knowledge-graph'],
        },
        {
          name: '数据与安全底座',
          en: 'Data & Security Foundation',
          body: '建设可治理、可观测、可复用的数据链路。',
          items: ['data-engineering'],
        },
      ],
    },
    directions: {
      eyebrow: 'TECHNOLOGY DIRECTIONS',
      title: '八项技术方向',
      lead: '围绕企业真实落地需求组织技术能力，不追逐概念。',
    },
    discipline: {
      eyebrow: 'ENGINEERING DISCIPLINE',
      title: '可验证的工程纪律',
      // PRD 12.1：替换设计稿中的 99.98% / 12ms / 180+ / 46% 指标
      pillars: [
        {
          title: '安全设计',
          body: '在架构阶段引入权限边界、数据分级与最小化采集，而不是事后补丁。',
        },
        {
          title: '工程创新',
          body: '以可复用的组件与评测方法推进模型与流程的持续迭代。',
        },
        {
          title: '可靠架构',
          body: '关键链路具备降级与回退方案，异常可观测、可定位。',
        },
      ],
    },
  },
  insightsPage: {
    hero: {
      eyebrow: 'INSIGHT',
      title: 'Research, perspective and field notes.',
      subtitle: '洞察：研究、观点与一线实践',
      lead: '围绕企业 AI 治理、数据基础与品牌智能的研究与观察。',
    },
    featuredLabel: '精选文章',
    latestLabel: '最新文章',
    allCategories: '全部',
    loadMore: '加载更多内容',
    emptyCategory: '该分类下暂无已发布文章。',
  },
  articleDetail: {
    eyebrow: 'INSIGHT',
    publishedAt: '发布于',
    relatedEyebrow: 'RELATED',
    relatedTitle: '相关文章',
    backToList: '返回行业洞察',
  },
  contactPage: {
    hero: {
      eyebrow: 'CONTACT US',
      title: "Let's build trusted intelligence together.",
      subtitle: '与我们一道，构建可信的企业智能',
      lead: '无论是方案咨询还是产品合作，告诉我们您的业务场景，我们会据此安排后续沟通。',
      emailLabel: '商务邮箱',
    },
    process: {
      eyebrow: 'HOW WE RESPOND',
      title: '提交之后会发生什么',
      steps: [
        { title: '需求确认', body: '我们阅读您的描述，确认场景、目标与涉及的系统范围。' },
        { title: '方案沟通', body: '由对应的业务或产品同事与您沟通可行路径与边界。' },
        { title: '后续跟进', body: '如需深入评估，我们会约定下一步的资料与参与人员。' },
      ],
    },
    form: {
      title: '商务合作咨询',
      subtitle: '带 * 的字段为必填项。',
      fields: {
        name: { label: '姓名', placeholder: '请输入您的姓名' },
        companyName: { label: '公司名称', placeholder: '请输入公司名称' },
        email: { label: '工作邮箱', placeholder: "name{'@'}company.com" },
        phone: { label: '联系电话', placeholder: '选填' },
        industry: { label: '所属行业', placeholder: '请选择所属行业' },
        cooperationType: { label: '合作方向', placeholder: '请选择合作方向' },
        targetProduct: { label: '意向产品', placeholder: '请选择意向产品' },
        message: { label: '需求描述', placeholder: '请简要描述您的业务场景、目标与时间安排' },
      },
      optional: '选填',
      unsure: '暂不确定',
      privacy: {
        prefix: '我已阅读并同意',
        link: '隐私政策',
        suffix: '，同意 VERINEX 就本次咨询与我联系。',
      },
      submit: '提交咨询',
      submitting: '提交中…',
      success: {
        title: '咨询已提交',
        body: '我们已收到您的信息，并将据此安排后续沟通。',
        again: '再次提交',
      },
      rateLimited: {
        title: '提交过于频繁',
        body: '相同内容或同一邮箱的提交过于频繁，请稍后再试。',
      },
      error: {
        title: '提交失败',
        body: '网络或服务出现异常，请稍后重试。您填写的内容已保留。',
      },
      errors: {
        name: '请输入 1–100 个字符的姓名',
        companyName: '请输入 1–160 个字符的公司名称',
        email: '请输入有效的邮箱地址',
        phone: '联系电话不能超过 40 个字符',
        cooperationType: '请选择合作方向',
        message: '请输入 1–5000 个字符的需求描述',
        privacyConsent: '请阅读并同意隐私政策',
      },
    },
  },
  // PRD 4.6 的五个文章分类（唯一边界，不含「客户案例」）
  articleCategories: {
    'ai-technology': 'AI 技术',
    'enterprise-ai': '企业 AI',
    'data-intelligence': '数据智能',
    'brand-intelligence': '品牌智能',
    'industry-research': '行业研究',
  },
  state: {
    loading: '内容加载中…',
    errorTitle: '内容暂时无法加载',
    errorBody: '网络或服务出现异常，请稍后重试。',
    retry: '重新加载',
    empty: '暂无内容。',
  },
  placeholder: {
    eyebrow: '本阶段未实现',
    title: '{page}',
    body: '本阶段完成工程初始化与全站布局骨架。该页面将在后续阶段依据 PRD 与 Pixso 设计稿实现，当前仅提供导航与版式占位。',
    back: '返回首页',
    loading: '加载中…',
  },
  privacy: {
    eyebrow: '法律信息',
    title: '隐私政策',
    body: '隐私政策正文将在上线前由项目负责人确认后发布。当前页面仅占位，不收集任何信息。',
    back: '返回首页',
  },
  notFound: {
    eyebrow: '404',
    title: '页面不存在',
    body: '您访问的地址不存在或已变更，请通过导航重新进入。',
    back: '返回首页',
  },
  seo: {
    home: {
      title: 'VERINEX TECHNOLOGIES — 以可信为基，以智能致远。',
      description:
        'VERINEX TECHNOLOGIES 专注企业级人工智能：数据智能、企业 AI 平台、AI 品牌智能与内容智能，帮助企业将数据转化为智能。',
    },
    about: {
      title: '关于我们 — VERINEX TECHNOLOGIES',
      description: '了解 VERINEX 的企业定位、使命、愿景与核心价值观。',
    },
    solutions: {
      title: '解决方案 — VERINEX TECHNOLOGIES',
      description: '数据智能、企业 AI、品牌智能、AI 内容与数据研究五大业务方向。',
    },
    products: {
      title: '产品中心 — VERINEX TECHNOLOGIES',
      description: 'VERICORPUS、VERIMIND、VERISTUDIO、VERIINSIGHT、VERIBRAND 五大产品平台。',
    },
    technology: {
      title: '技术能力 — VERINEX TECHNOLOGIES',
      description: '大模型、RAG、AI Agent、知识图谱与数据工程等技术方向。',
    },
    insights: {
      title: '行业洞察 — VERINEX TECHNOLOGIES',
      description: 'AI 技术、企业 AI、数据智能与品牌智能领域的研究与观察。',
    },
    contact: {
      title: '联系我们 — VERINEX TECHNOLOGIES',
      description: '与 VERINEX 商务团队联系，探讨企业人工智能落地路径。',
    },
    privacy: {
      title: '隐私政策 — VERINEX TECHNOLOGIES',
      description: 'VERINEX TECHNOLOGIES 隐私政策。',
    },
  },
  a11y: {
    skipToContent: '跳到主内容',
    primaryNav: '主导航',
    footerNav: '页脚导航',
    languageSwitch: '切换语言',
    currentPage: '当前页面',
    externalLink: '在新窗口打开',
  },
}

export default zhCN
export type MessageSchema = typeof zhCN
