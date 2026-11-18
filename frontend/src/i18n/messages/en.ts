import type { MessageSchema } from './zh-CN'

/**
 * English UI copy. Must stay semantically aligned with zh-CN.ts —
 * the type annotation enforces key/shape parity at compile time.
 */
const en: MessageSchema = {
  editorial: {
    solutionSecondaryNames: {
      "data-intelligence": "数据智能",
      "enterprise-ai": "企业 AI 解决方案",
      "brand-intelligence": "品牌智能",
      "ai-content": "AI 内容解决方案",
      "research-insights": "数据研究与洞察"
} as Record<string, string>,
    capabilitiesTitle: 'Four disciplines. One considered approach.',
    "aboutTitle": "Grounded in truth.\nBuilt for possibility.",
    "purpose": "Mission & vision",
    "solutionsTitle": "Connecting data\nto what comes next.",
    "productsTitle": "Distinct by purpose.\nConnected by possibility.",
    "technologyTitle": "Clear architecture.\nTrusted intelligence.",
    "engineering": "Our engineering philosophy",
    "engineeringBody": "Traceability, explainability and governance guide the path from data sources to model outputs. We plan enterprise AI around clear system responsibilities, continuous evaluation and human review, with technology assessed against real business boundaries.",
    "insightsTitle": "Ideas. Evidence.\nNew perspectives.",
    "contactTitle": "Every possibility starts\nwith a conversation.",
    "flow": [
        "Data",
        "Knowledge",
        "Intelligence"
    ],
    "domains": [
        "Data & knowledge engineering",
        "Models & multimodal AI",
        "Agents & automation",
        "Enterprise integration"
    ],
    "domainDescriptions": [
        "Organise data and knowledge to ground retrieval and generation.",
        "Explore model selection, inference and multimodal understanding.",
        "Bring task planning and human review into intelligent workflows.",
        "Plan enterprise AI around permissions, processes and system boundaries."
    ]
},
  meta: {
    siteName: 'VERINEX TECHNOLOGIES',
  },
  brand: {
    name: 'VERINEX',
    technologies: 'TECHNOLOGIES',
    chinese: '维真科技',
    slogan: 'Intelligence Built on Trust.',
  },
  nav: {
    home: 'Home',
    about: 'About Us',
    solutions: 'Solutions',
    products: 'Products',
    technology: 'Technology',
    insights: 'Insights',
    contact: 'Contact',
  },
  actions: {
    contactUs: 'Contact Us',
    exploreSolutions: 'Explore Solutions',
    discoverProducts: 'Discover Products',
    bookDemo: 'Book a Demo',
    contactSales: 'Contact Sales',
    learnMore: 'Learn More',
  },
  header: {
    utility: 'VERINEX TECHNOLOGIES · 维真科技',
    badge: 'Trusted AI',
    tagline: 'Intelligence Built on Trust.',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
    language: 'Language',
  },
  footer: {
    description:
      'Exploring the possibilities of data, knowledge and enterprise intelligence.',
    columns: {
      solutions: 'Solutions',
      products: 'Products',
      company: 'Company',
      contact: 'Contact',
    },
    solutions: {
      dataIntelligence: 'Data Intelligence',
      enterpriseAi: 'Enterprise AI',
      brandIntelligence: 'Brand Intelligence',
      aiContent: 'AI Content',
      dataResearch: 'Data Research & Insights',
    },
    company: {
      about: 'About Us',
      technology: 'Technology',
      insights: 'Insights',
      contact: 'Contact Us',
    },
    contact: {
      emailLabel: 'Business enquiries',
      cta: 'Start a conversation',
    },
    legal: {
      privacy: 'Privacy Policy',
    },
    rights: '© {year} VERINEX TECHNOLOGIES. All rights reserved.',
  },
  cta: {
    eyebrow: 'Work with us',
    title: 'Trusted intelligence.\nIt starts with a conversation.',
    subtitle: 'Tell us about your business. Let’s explore what data and AI could make possible.',
    primary: 'Start a conversation',
    secondary: 'Contact Sales',
  },
  home: {
    hero: {
      eyebrow: 'VERINEX · Enterprise intelligence',
      title: 'Intelligence Built on Trust.',
      lineOne: 'Intelligence ',
      lineTwo: 'Built on Trust.',
      scroll: 'Explore VERINEX',
      subtitle: 'Transforming Data into Intelligence. Empowering the Future of Business.',
      note: 'Data Intelligence · Enterprise AI · Brand Intelligence · AI Content · Research',
      // PRD 12.1: unverified design metrics (120+, 99.98% …) replaced by capability statements
      capabilities: [
        'Enterprise Intelligence',
        'Reliable AI Architecture',
        'Engineering Innovation',
        'Security by Design',
      ],
    },
    about: {
      eyebrow: 'About VERINEX',
      title: 'Data and AI capabilities, governed and reliable, serving real business.',
      link: 'About VERINEX',
    },
    solutions: {
      eyebrow: 'Core business',
      title: 'Business challenges.\nIntelligent possibilities.',
      lead: 'Five areas of focus, connecting data, knowledge and enterprise applications.',
      viewAll: 'Explore all solutions',
      cardCta: 'Learn more',
      customCard: {
        title: 'Need a tailored industry intelligence solution?',
        body: 'Tell us about your business scenario and we will map a practical path together.',
        cta: 'Book a consultation',
      },
    },
    products: {
      eyebrow: 'Product ecosystem',
      title: 'Five product directions.\nOne intelligent vision.',
      lead: 'Five focused platforms being planned around enterprise data, intelligent applications and brand content.',
      viewAll: 'Browse all products',
      cardCta: 'Explore product',
    },
    technology: {
      eyebrow: 'Technology',
      title: 'Intelligence with a foundation.',
      lead: 'From data engineering to multimodal AI, exploring traceable and governable paths to enterprise intelligence.',
      viewAll: 'Explore our technology',
      // PRD 12.1: design metrics (46% / 12ms / SOC 2) replaced by capability statements
      pillars: ['Engineering Innovation', 'Reliable AI Architecture', 'Security by Design'],
    },
    industries: {
      eyebrow: 'Industry focus',
      title: 'Intelligence scenarios across key industries',
      lead: 'The same trusted technology foundation, adapted to industry-specific data and workflows.',
    },
    perspectives: { eyebrow: 'Technology & perspectives', title: 'Grounded in technology. Driven by curiosity.' },
    insights: {
      eyebrow: 'Insights',
      title: 'Frontier insights, evolving with the industry',
      viewAll: 'View all insights',
    },
  },
  about: {
    facts: {
      mission: 'Mission',
      vision: 'Vision',
      values: 'Values',
    },
    hero: {
      eyebrow: 'ABOUT VERINEX',
      title: 'Built by engineers, defined by trust.',
      subtitle: 'Intelligence Built on Trust.',
      // PRD 12.1: founding year / headcount / client count metrics replaced
      capabilities: [
        'Enterprise Intelligence',
        'Reliable AI Architecture',
        'Engineering Innovation',
        'Research & Engineering',
      ],
    },
    mission: {
      eyebrow: 'OUR MISSION',
      title: 'Every intelligent decision, verified and trusted',
      visionLabel: 'Our Vision',
      missionLabel: 'Our Mission',
      // PRD 12.1: design metrics (8 / 680 / 46 / 99.9%) replaced
      pillars: ['Auditable', 'Explainable', 'Scalable', 'Governable'],
    },
    values: {
      eyebrow: 'VALUES',
      title: 'Four principles we stand by',
      lead: 'Values are not slogans — they are the standard behind every technical choice and delivery decision.',
      items: {
        Authenticity:
          'We communicate real data, real capabilities and real progress. No exaggeration, no fabrication.',
        Professionalism:
          'Engineering discipline and professional rigor in every technical detail and business commitment.',
        Innovation:
          'Continuous exploration of LLMs, agents and data intelligence within trusted boundaries.',
        Responsibility:
          'Accountable for data security, algorithmic impact and client business outcomes.',
      } as Record<string, string>,
    },
    philosophy: {
      eyebrow: 'OUR PHILOSOPHY',
      title: 'Our philosophy: trust first, engineering driven',
      lead: 'The timeline stays hidden until facts are confirmed. We believe enterprise AI value comes from verifiable engineering practice.',
      items: [
        {
          title: 'Auditable',
          body: 'Every model call, data flow and decision rationale can be traced and reviewed.',
        },
        {
          title: 'Explainable',
          body: 'Enterprises understand how AI reasons — no black-box outcomes.',
        },
        {
          title: 'Governable',
          body: 'Data, knowledge, permissions and workflows operate under one governance framework.',
        },
        {
          title: 'Scalable',
          body: 'Architecture evolves smoothly with business scale, free from single-point lock-in.',
        },
      ],
    },
    team: {
      eyebrow: 'OUR TEAM',
      title: 'A team of researchers and engineers',
      body: 'VERINEX is built by hands-on researchers and engineers focused on enterprise intelligence. Individual profiles will be published once verified.',
    },
  },
  productStage: {
    PLANNED: 'Planned',
    IN_DEVELOPMENT: 'In development',
    RELEASED: 'Released',
  },
  solutionsPage: {
    hero: {
      eyebrow: 'SOLUTIONS',
      title: 'Five capabilities. One trusted intelligence stack.',
      subtitle: 'Five core business lines across the enterprise intelligence stack',
      lead: 'From data foundations to business intelligence, VERINEX modules let enterprises move at their own pace — every step measurable and verifiable.',
    },
    lines: {
      eyebrow: 'CORE BUSINESS LINES',
      title: 'Core business lines',
      count: '{count} business directions',
    },
    capabilitiesLabel: 'Core capabilities',
    detailCta: 'View solution',
    process: {
      eyebrow: 'HOW WE WORK',
      title: 'A four-step path from diagnosis to launch',
      steps: [
        {
          step: 'STEP 01',
          title: 'Diagnostic assessment',
          body: 'Starting from business goals and data reality, we define viable entry points and priorities.',
        },
        {
          step: 'STEP 02',
          title: 'Solution design',
          body: 'We design the data, model and process plan around your scenarios and existing systems.',
        },
        {
          step: 'STEP 03',
          title: 'Joint validation',
          body: 'Results are validated in measurable ways and refined in real business operations.',
        },
        {
          step: 'STEP 04',
          title: 'Scaled rollout',
          body: 'Governance, permissions and operations are prepared so capabilities scale across the organisation.',
        },
      ],
    },
  },
  // PRD 4.3: confirmed solution capabilities by business code
  solutionCapabilities: {
    'data-intelligence': [
      'Data collection & governance',
      'Enterprise knowledge base',
      'Knowledge graph',
      'Corpus management',
    ],
    'enterprise-ai': [
      'LLM applications',
      'RAG systems',
      'AI agents',
      'Intelligent workflows',
      'Private deployment',
    ],
    'brand-intelligence': [
      'GEO',
      'AI brand perception analysis',
      'AI search visibility monitoring',
      'Brand semantic optimisation',
    ],
    'ai-content': [
      'AI content generation',
      'Multimodal content processing',
      'Content management',
      'Content quality review',
    ],
    'research-insights': [
      'Industry research',
      'Market analysis',
      'Consumer preference research',
      'Data visualisation',
    ],
  } as Record<string, string[]>,
  solutionScenarios: {
    'data-intelligence': [
      'Unified governance and quality improvement for multi-source business data',
      'Cross-department knowledge retrieval and knowledge asset management',
      'Corpus preparation and versioning for large language models',
    ],
    'enterprise-ai': [
      'Enterprise knowledge Q&A and retrieval-augmented applications',
      'Agent orchestration across system-spanning business processes',
      'Private deployment scenarios with strict data compliance requirements',
    ],
    'brand-intelligence': [
      'Brand content strategy in generative search environments',
      'Structured organisation of brand semantic assets',
      'A framework for continuous brand perception monitoring',
    ],
    'ai-content': [
      'Scaled production of multi-format marketing content',
      'Content review and quality governance workflows',
      'Unified management and reuse of content assets',
    ],
    'research-insights': [
      'Structured analysis for industry and market research',
      'Consumer preference and demand insight',
      'Visualisation and reporting of operational data',
    ],
  } as Record<string, string[]>,
  solutionDetail: {
    eyebrow: 'SOLUTION',
    capabilitiesTitle: 'Core capabilities',
    scenariosEyebrow: 'SCENARIOS',
    scenariosTitle: 'Application scenarios',
    scenariosNote: 'Typical scenarios for this solution. Final scope is subject to project assessment.',
    contactTitle: 'Plan this path with us',
    contactBody: 'Tell us your goals and current state — we will propose an actionable plan.',
    contactCta: 'Contact the team',
    relatedEyebrow: 'MORE SOLUTIONS',
    relatedTitle: 'Other solutions',
    backToList: 'Back to solutions',
  },
  productsPage: {
    hero: {
      eyebrow: 'PRODUCT SUITE',
      title: 'One platform. Five interoperable products.',
      subtitle: 'Five products, one trusted intelligence infrastructure',
      lead: 'VERINEX products share a unified data model, permission system and delivery framework — deploy individually or combine into an enterprise AI core.',
    },
    matrix: {
      eyebrow: 'PRODUCT MATRIX',
      title: 'Product matrix',
      note: 'All products are currently planned. Page content describes product direction only.',
    },
    detailCta: 'Product details',
    guide: {
      title: 'Not sure where to start?',
      body: 'Tell us your scenarios and data landscape — we will identify the right product combination with you.',
      cta: 'Talk to a product advisor',
    },
  },
  productDetail: {
    eyebrow: 'PRODUCT',
    featuresTitle: 'Core capabilities',
    stageLabel: 'Product status',
    stageNotes: {
      PLANNED:
        'This product is currently planned. Content describes product direction and does not imply a released or delivered product.',
      IN_DEVELOPMENT:
        'This product is in development. Scope and availability are subject to official release information.',
      RELEASED:
        'This product is released. Specific capabilities and delivery scope are subject to commercial agreement.',
    },
    contactTitle: 'Discuss how this product fits your business',
    contactBody: 'We can review your data and processes, and clarify capability boundaries and an implementation path.',
    contactCta: 'Contact the product team',
    relatedEyebrow: 'MORE PRODUCTS',
    relatedTitle: 'Other products',
    backToList: 'Back to products',
  },
  technologyPage: {
    hero: {
      eyebrow: 'TECHNOLOGY',
      title: 'Trust architecture, engineered for scale.',
      subtitle: 'A trusted architecture, engineered for scale',
      lead: 'From the data foundation to agent orchestration, one architecture that keeps enterprise intelligence auditable, explainable and governable.',
      // PRD 12.1: certification marks in the design replaced with capability statements
      chips: ['Auditable', 'Explainable', 'Governable', 'Security by Design'],
    },
    architecture: {
      eyebrow: 'ARCHITECTURE',
      title: 'Four layers, one trusted intelligence core',
      lead: 'Each layer has clear responsibilities and loose coupling, so model capabilities enter business systems within controlled boundaries.',
      layers: [
        {
          name: 'Application & Agent Layer',
          en: 'Application & Agent Layer',
          body: 'Model capabilities packaged as governable business applications and agent workflows.',
          items: ['ai-agents', 'intelligent-automation', 'enterprise-ai-integration'],
        },
        {
          name: 'Model & Inference Layer',
          en: 'Model & Inference Layer',
          body: 'Model selection, integration, evaluation and inference efficiency.',
          items: ['llm', 'multimodal-ai'],
        },
        {
          name: 'Knowledge & Retrieval Layer',
          en: 'Knowledge & Retrieval Layer',
          body: 'Traceable enterprise knowledge grounding retrieval and generation.',
          items: ['rag', 'knowledge-graph'],
        },
        {
          name: 'Data & Security Foundation',
          en: 'Data & Security Foundation',
          body: 'Governable, observable and reusable data pipelines.',
          items: ['data-engineering'],
        },
      ],
    },
    directions: {
      eyebrow: 'TECHNOLOGY DIRECTIONS',
      title: 'Eight technology directions',
      lead: 'Technology capabilities organised around real enterprise adoption needs.',
    },
    discipline: {
      eyebrow: 'ENGINEERING DISCIPLINE',
      title: 'Verifiable engineering discipline',
      // PRD 12.1: design metrics (99.98% / 12ms / 180+ / 46%) replaced
      pillars: [
        {
          title: 'Security by Design',
          body: 'Permission boundaries, data classification and minimal collection designed in from the start.',
        },
        {
          title: 'Engineering Innovation',
          body: 'Reusable components and evaluation methods drive continuous iteration of models and workflows.',
        },
        {
          title: 'Reliable Architecture',
          body: 'Critical paths have degradation and fallback plans; anomalies are observable and traceable.',
        },
      ],
    },
  },
  insightsPage: {
    hero: {
      eyebrow: 'INSIGHT',
      title: 'Research, perspective and field notes.',
      subtitle: 'Research, perspective and hands-on practice',
      lead: 'Perspectives on enterprise AI governance, data foundations and brand intelligence.',
    },
    featuredLabel: 'Featured article',
    latestLabel: 'Latest articles',
    allCategories: 'All',
    loadMore: 'Load more',
    emptyCategory: 'No published articles in this category yet.',
  },
  articleDetail: {
    eyebrow: 'INSIGHT',
    publishedAt: 'Published',
    relatedEyebrow: 'RELATED',
    relatedTitle: 'Related articles',
    backToList: 'Back to insights',
  },
  contactPage: {
    hero: {
      eyebrow: 'CONTACT US',
      title: "Let's build trusted intelligence together.",
      subtitle: 'Build trusted enterprise intelligence with us',
      lead: 'Whether you are exploring a solution or a product partnership, tell us about your scenario and we will follow up accordingly.',
      emailLabel: 'Business email',
    },
    process: {
      eyebrow: 'HOW WE RESPOND',
      title: 'What happens after you submit',
      steps: [
        {
          title: 'Requirement review',
          body: 'We read your description and confirm the scenario, goals and systems involved.',
        },
        {
          title: 'Solution discussion',
          body: 'The relevant business or product team discusses a viable path and its boundaries with you.',
        },
        {
          title: 'Follow-up',
          body: 'If deeper assessment is needed, we agree on next materials and participants.',
        },
      ],
    },
    form: {
      title: 'Business enquiry',
      subtitle: 'Fields marked * are required.',
      fields: {
        name: { label: 'Name', placeholder: 'Your name' },
        companyName: { label: 'Company', placeholder: 'Your company name' },
        email: { label: 'Work email', placeholder: "name{'@'}company.com" },
        phone: { label: 'Phone', placeholder: 'Optional' },
        industry: { label: 'Industry', placeholder: 'Select your industry' },
        cooperationType: { label: 'Area of interest', placeholder: 'Select an area' },
        targetProduct: { label: 'Product of interest', placeholder: 'Select a product' },
        message: {
          label: 'Requirement',
          placeholder: 'Briefly describe your scenario, goals and timing',
        },
      },
      optional: 'Optional',
      unsure: 'Not sure yet',
      privacy: {
        prefix: 'I have read and agree to the',
        link: 'Privacy Policy',
        suffix: ', and consent to VERINEX contacting me about this enquiry.',
      },
      submit: 'Submit enquiry',
      submitting: 'Submitting…',
      success: {
        title: 'Enquiry received',
        body: 'We have received your details and will arrange a follow-up.',
        again: 'Submit another enquiry',
      },
      rateLimited: {
        title: 'Too many submissions',
        body: 'The same content or email has been submitted too frequently. Please try again later.',
      },
      error: {
        title: 'Submission failed',
        body: 'A network or service error occurred. Please try again — your input has been kept.',
      },
      errors: {
        name: 'Enter a name of 1–100 characters',
        companyName: 'Enter a company name of 1–160 characters',
        email: 'Enter a valid email address',
        phone: 'Phone must not exceed 40 characters',
        cooperationType: 'Select an area of interest',
        message: 'Enter a requirement of 1–5000 characters',
        privacyConsent: 'Please read and accept the privacy policy',
      },
    },
  },
  // PRD 4.6: the five article categories (exclusive boundary, no "customer cases")
  articleCategories: {
    'ai-technology': 'AI Technology',
    'enterprise-ai': 'Enterprise AI',
    'data-intelligence': 'Data Intelligence',
    'brand-intelligence': 'Brand Intelligence',
    'industry-research': 'Industry Research',
  },
  state: {
    loading: 'Loading…',
    errorTitle: 'Content unavailable',
    errorBody: 'A network or service error occurred. Please try again.',
    retry: 'Retry',
    empty: 'No content yet.',
  },
  placeholder: {
    eyebrow: 'Not in this stage',
    title: '{page}',
    body: 'This stage delivers project scaffolding and the global layout shell. The page will be implemented from the PRD and Pixso design in a later stage; only navigation and layout placeholders are available now.',
    back: 'Back to home',
    loading: 'Loading…',
  },
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    body: 'The privacy policy text will be published after final review before launch. This page is a placeholder and collects no information.',
    back: 'Back to home',
  },
  notFound: {
    eyebrow: '404',
    title: 'Page not found',
    body: 'The address you visited does not exist or has changed. Please use the navigation to continue.',
    back: 'Back to home',
  },
  seo: {
    home: {
      title: 'VERINEX TECHNOLOGIES — Intelligence Built on Trust.',
      description:
        'VERINEX TECHNOLOGIES builds enterprise AI infrastructure across data intelligence, enterprise AI platforms, brand intelligence and AI content.',
    },
    about: {
      title: 'About Us — VERINEX TECHNOLOGIES',
      description: 'Our positioning, mission, vision and core values.',
    },
    solutions: {
      title: 'Solutions — VERINEX TECHNOLOGIES',
      description:
        'Five business lines: data intelligence, enterprise AI, brand intelligence, AI content and data research.',
    },
    products: {
      title: 'Products — VERINEX TECHNOLOGIES',
      description: 'VERICORPUS, VERIMIND, VERISTUDIO, VERIINSIGHT and VERIBRAND platform portfolio.',
    },
    technology: {
      title: 'Technology — VERINEX TECHNOLOGIES',
      description: 'Large language models, RAG, AI agents, knowledge graphs and data engineering.',
    },
    insights: {
      title: 'Insights — VERINEX TECHNOLOGIES',
      description: 'Research and perspectives on AI technology, enterprise AI and data intelligence.',
    },
    contact: {
      title: 'Contact — VERINEX TECHNOLOGIES',
      description: 'Talk to the VERINEX team about enterprise AI adoption.',
    },
    privacy: {
      title: 'Privacy Policy — VERINEX TECHNOLOGIES',
      description: 'VERINEX TECHNOLOGIES privacy policy.',
    },
  },
  a11y: {
    skipToContent: 'Skip to main content',
    primaryNav: 'Primary navigation',
    footerNav: 'Footer navigation',
    languageSwitch: 'Switch language',
    currentPage: 'Current page',
    externalLink: 'Opens in a new window',
  },
}

export default en
