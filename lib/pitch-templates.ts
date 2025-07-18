export interface SlideTemplate {
  title: string
  content: string
  tips: string[]
}

export interface IndustryTemplate {
  name: string
  description: string
  keyMetrics: string[]
  slides: SlideTemplate[]
  focusAreas: string[]
}

export const industryTemplates: Record<string, IndustryTemplate> = {
  saas: {
    name: "SaaS & Software",
    description: "Software as a Service and B2B software companies",
    keyMetrics: ["MRR/ARR", "Churn Rate", "CAC/LTV", "Net Revenue Retention", "Product-Market Fit"],
    focusAreas: ["Recurring Revenue", "Scalability", "Customer Success", "Product Stickiness"],
    slides: [
      {
        title: "Company Overview",
        content:
          "We're building [Company Name], a [specific SaaS solution] that helps [target customer] achieve [key outcome] through [unique approach].",
        tips: [
          "Lead with the outcome you deliver",
          "Be specific about your target market",
          "Highlight your unique approach",
        ],
      },
      {
        title: "Problem",
        content:
          "[Target customers] struggle with [specific pain point] which costs them [quantified impact] in [time/money/efficiency]. Current solutions are [limitation 1], [limitation 2], and [limitation 3].",
        tips: [
          "Quantify the pain with real numbers",
          "Show you understand the market deeply",
          "Highlight gaps in existing solutions",
        ],
      },
      {
        title: "Solution",
        content:
          "Our platform solves this by [core functionality] that enables [key benefits]. Unlike alternatives, we [unique differentiator] resulting in [measurable outcome].",
        tips: [
          "Focus on outcomes, not features",
          "Clearly state your differentiation",
          "Use customer language, not tech jargon",
        ],
      },
      {
        title: "Market Opportunity",
        content:
          "The [specific market segment] market is worth $[TAM] and growing at [growth rate]%. Our serviceable addressable market (SAM) is $[SAM] with [number] potential customers.",
        tips: [
          "Use bottom-up market sizing",
          "Show market growth trends",
          "Be realistic about your addressable market",
        ],
      },
      {
        title: "Product Demo",
        content:
          "Our platform includes: [Feature 1] - [benefit], [Feature 2] - [benefit], [Feature 3] - [benefit]. The user workflow is: [step 1] → [step 2] → [outcome].",
        tips: ["Show, don't just tell", "Focus on user workflow", "Highlight key differentiating features"],
      },
      {
        title: "Business Model",
        content:
          "We operate on a [subscription model] with pricing tiers: [Tier 1] at $[price], [Tier 2] at $[price]. Average customer pays $[ARPU] with [contract length] contracts.",
        tips: ["Show clear pricing strategy", "Demonstrate unit economics", "Explain expansion revenue opportunities"],
      },
      {
        title: "Traction & Metrics",
        content:
          "Current metrics: $[MRR] MRR growing [growth rate]% monthly, [number] customers, [churn rate]% monthly churn, $[CAC] CAC with $[LTV] LTV ([LTV:CAC ratio] ratio).",
        tips: ["Lead with revenue metrics", "Show consistent growth", "Prove strong unit economics"],
      },
      {
        title: "Competition",
        content:
          "We compete with [Competitor 1] (limited by [weakness]), [Competitor 2] (lacks [capability]), and internal solutions (time-consuming). Our advantage: [key differentiator].",
        tips: ["Acknowledge real competition", "Show clear differentiation", "Position against status quo"],
      },
      {
        title: "Go-to-Market Strategy",
        content:
          "We acquire customers through [Channel 1] (cost: $[CAC], conversion: [rate]%), [Channel 2] (cost: $[CAC], conversion: [rate]%). Sales cycle: [duration] with [close rate]% close rate.",
        tips: ["Show proven acquisition channels", "Include specific metrics", "Demonstrate scalable processes"],
      },
      {
        title: "Team",
        content:
          "Led by [Founder] ([background in relevant area]), [CTO] ([technical expertise]), [VP Sales] ([sales track record]). Combined [years] years in [industry] with [relevant achievements].",
        tips: ["Highlight relevant experience", "Show complementary skills", "Include notable achievements"],
      },
      {
        title: "Financial Projections",
        content:
          "Projecting $[revenue] revenue by Year 3 with [margin]% gross margins. Key assumptions: [customers] customers at $[ARPU] ARPU with [churn]% annual churn.",
        tips: ["Show realistic growth trajectory", "Include key assumptions", "Demonstrate path to profitability"],
      },
      {
        title: "Funding Ask",
        content:
          "Raising $[amount] to achieve [milestone 1], [milestone 2], and [milestone 3]. Use of funds: [%] product development, [%] sales & marketing, [%] team expansion.",
        tips: ["Be specific about use of funds", "Tie to clear milestones", "Show how funding accelerates growth"],
      },
    ],
  },

  fintech: {
    name: "Fintech & Financial Services",
    description: "Financial technology and financial services companies",
    keyMetrics: ["Transaction Volume", "Take Rate", "AUM", "Regulatory Compliance", "Security Metrics"],
    focusAreas: ["Regulatory Compliance", "Security", "Trust", "Network Effects", "Financial Metrics"],
    slides: [
      {
        title: "Company Overview",
        content:
          "We're revolutionizing [financial service area] by providing [target customers] with [key value proposition] that [outcome achieved].",
        tips: ["Emphasize trust and reliability", "Highlight regulatory compliance", "Show deep financial expertise"],
      },
      {
        title: "Problem",
        content:
          "Traditional [financial service] is broken: [pain point 1] costs users $[amount], [pain point 2] creates [friction], and [pain point 3] excludes [underserved population].",
        tips: ["Quantify financial impact", "Show regulatory gaps", "Highlight underserved markets"],
      },
      {
        title: "Solution",
        content:
          "Our platform enables [core functionality] through [technology/approach] that reduces costs by [%], improves [metric] by [amount], and serves [previously excluded group].",
        tips: ["Emphasize cost savings", "Show improved user experience", "Highlight inclusion benefits"],
      },
      {
        title: "Market Opportunity",
        content:
          "The [financial sector] processes $[volume] annually. Our target segment represents $[TAM] with [growth rate]% annual growth driven by [trend 1] and [trend 2].",
        tips: ["Use transaction volume data", "Show regulatory tailwinds", "Highlight demographic shifts"],
      },
      {
        title: "Product & Technology",
        content:
          "Built on [technology stack] with [security features]. Core capabilities: [feature 1], [feature 2], [feature 3]. API-first architecture enables [integration benefits].",
        tips: [
          "Emphasize security and compliance",
          "Show technical differentiation",
          "Highlight integration capabilities",
        ],
      },
      {
        title: "Business Model",
        content:
          "Revenue streams: [%] transaction fees ([rate]% take rate), [%] subscription fees ($[amount] per user), [%] interchange/spread ([basis points]).",
        tips: ["Show multiple revenue streams", "Include take rates and spreads", "Demonstrate scalable economics"],
      },
      {
        title: "Regulatory & Compliance",
        content:
          "Licensed as [license type] in [jurisdictions]. Compliant with [regulation 1], [regulation 2]. Partnerships with [regulated entity] for [compliance area].",
        tips: ["Show regulatory readiness", "Highlight compliance investments", "Demonstrate regulatory relationships"],
      },
      {
        title: "Traction & Metrics",
        content:
          "Processing $[volume] monthly volume, [number] active users, [%] month-over-month growth. Key metrics: [take rate]% take rate, $[CAC] CAC, [retention]% user retention.",
        tips: ["Lead with transaction volume", "Show user growth", "Include financial efficiency metrics"],
      },
      {
        title: "Partnerships & Distribution",
        content:
          "Strategic partnerships with [Partner 1] ([benefit]), [Partner 2] ([distribution channel]). Integration with [Platform] reaches [number] potential users.",
        tips: ["Show strategic partnerships", "Highlight distribution advantages", "Demonstrate network effects"],
      },
      {
        title: "Security & Risk Management",
        content:
          "Security: [encryption standard], [compliance certification], [security measures]. Risk management: [risk controls], [monitoring systems], [insurance coverage].",
        tips: ["Emphasize security measures", "Show risk mitigation", "Highlight insurance and compliance"],
      },
      {
        title: "Financial Projections",
        content:
          "Projecting $[revenue] revenue by Year 3 processing $[volume] in transactions. Unit economics: $[CAC] CAC, $[LTV] LTV, [months] payback period.",
        tips: ["Show transaction volume growth", "Include unit economics", "Demonstrate scalable margins"],
      },
      {
        title: "Funding Ask",
        content:
          "Raising $[amount] for [regulatory expansion], [product development], and [market expansion]. Funds enable processing $[volume] and serving [customers] by [timeline].",
        tips: ["Tie to regulatory milestones", "Show capital efficiency", "Highlight growth acceleration"],
      },
    ],
  },

  healthcare: {
    name: "Healthcare & Biotech",
    description: "Healthcare technology, medical devices, and biotechnology companies",
    keyMetrics: ["Clinical Outcomes", "Regulatory Milestones", "Patient Adoption", "Cost Savings", "Safety Profile"],
    focusAreas: ["Clinical Evidence", "Regulatory Pathway", "Patient Outcomes", "Healthcare Economics", "Safety"],
    slides: [
      {
        title: "Company Overview",
        content:
          "We're developing [medical solution] to treat [condition/problem] affecting [patient population]. Our approach [unique methodology] has shown [key clinical outcome].",
        tips: ["Lead with patient impact", "Highlight clinical evidence", "Show clear medical need"],
      },
      {
        title: "Medical Problem",
        content:
          "[Condition] affects [number] patients globally, costing healthcare systems $[amount] annually. Current treatments have [limitation 1], [limitation 2], with [%] of patients experiencing [adverse outcome].",
        tips: ["Quantify patient impact", "Show healthcare economic burden", "Highlight treatment gaps"],
      },
      {
        title: "Solution & Mechanism",
        content:
          "Our [solution type] works by [mechanism of action] to achieve [therapeutic outcome]. Unlike existing treatments, we [differentiation] resulting in [improved outcome].",
        tips: ["Explain mechanism clearly", "Show clinical differentiation", "Use accessible language"],
      },
      {
        title: "Clinical Evidence",
        content:
          "Clinical results: [primary endpoint] improved by [%], [secondary endpoint] showed [result]. Safety profile: [adverse events rate]% vs [comparator rate]% for standard care.",
        tips: ["Lead with primary endpoints", "Show statistical significance", "Highlight safety advantages"],
      },
      {
        title: "Market Opportunity",
        content:
          "Target market: [patient population] patients with $[market size] annual treatment costs. Market growing [%] annually due to [demographic trend] and [clinical trend].",
        tips: ["Size by patient population", "Include treatment costs", "Show market growth drivers"],
      },
      {
        title: "Regulatory Pathway",
        content:
          "Regulatory strategy: [pathway] designation with [regulatory body]. Timeline: [Phase] completion by [date], [submission type] filing [date], approval expected [timeframe].",
        tips: ["Show clear regulatory path", "Include realistic timelines", "Highlight regulatory advantages"],
      },
      {
        title: "Competitive Landscape",
        content:
          "Current standard of care: [treatment] with [limitations]. Pipeline competitors: [Competitor 1] ([stage], [limitation]), [Competitor 2] ([differentiation]).",
        tips: ["Compare to standard of care", "Show competitive advantages", "Include pipeline analysis"],
      },
      {
        title: "Business Model",
        content:
          "Revenue model: [pricing strategy] at $[price] per [unit]. Target customers: [payers/providers] with [reimbursement strategy]. Market access through [channels].",
        tips: ["Show clear pricing rationale", "Address reimbursement", "Demonstrate market access"],
      },
      {
        title: "Development Timeline",
        content:
          "Milestones: [Current phase] completion [date], [Next phase] initiation [date], [Regulatory milestone] [date], commercial launch [timeframe].",
        tips: ["Show realistic timelines", "Include key milestones", "Highlight de-risking events"],
      },
      {
        title: "Team & Advisors",
        content:
          "Led by [Founder] ([medical/scientific background]), [CMO] ([clinical expertise]), [CRO] ([regulatory experience]). Advisory board includes [Key Advisor] ([credentials]).",
        tips: ["Highlight medical expertise", "Show regulatory experience", "Include key opinion leaders"],
      },
      {
        title: "Financial Projections",
        content:
          "Peak sales projection: $[revenue] by Year [X] treating [%] of addressable patients. Development costs: $[amount] to approval, commercial launch requires $[amount].",
        tips: ["Show peak sales potential", "Include development costs", "Demonstrate commercial viability"],
      },
      {
        title: "Funding Ask",
        content:
          "Raising $[amount] to complete [clinical milestone], advance [development activity], and prepare for [next phase]. Funding takes us to [value inflection point].",
        tips: ["Tie to clinical milestones", "Show value inflection", "Include risk mitigation"],
      },
    ],
  },

  ecommerce: {
    name: "E-commerce & Retail",
    description: "E-commerce platforms, retail technology, and consumer brands",
    keyMetrics: ["GMV", "Conversion Rate", "AOV", "Customer Acquisition Cost", "Inventory Turnover"],
    focusAreas: ["Customer Experience", "Supply Chain", "Brand Building", "Unit Economics", "Market Expansion"],
    slides: [
      {
        title: "Company Overview",
        content:
          "We're building [brand/platform] that serves [target customers] with [product category] through [unique approach]. We've achieved [key traction metric] in [timeframe].",
        tips: ["Define your category clearly", "Show customer focus", "Highlight early traction"],
      },
      {
        title: "Market Problem",
        content:
          "Customers in [category] face [pain point 1] leading to [consequence], [pain point 2] causing [friction], and [pain point 3] resulting in [dissatisfaction].",
        tips: ["Focus on customer pain points", "Show market inefficiencies", "Quantify customer impact"],
      },
      {
        title: "Solution & Value Proposition",
        content:
          "We solve this through [approach] that delivers [benefit 1], [benefit 2], and [benefit 3]. Our unique advantage is [differentiation] enabling [customer outcome].",
        tips: ["Lead with customer benefits", "Show clear differentiation", "Focus on customer outcomes"],
      },
      {
        title: "Market Opportunity",
        content:
          "The [product category] market is $[size] growing [%] annually. Our target segment represents $[TAM] with [trend 1] and [trend 2] driving growth.",
        tips: ["Size the category market", "Show growth trends", "Identify market drivers"],
      },
      {
        title: "Product & Customer Experience",
        content:
          "Our platform offers [core features] with [unique capabilities]. Customer journey: [discovery] → [consideration] → [purchase] → [retention] with [conversion rates] at each stage.",
        tips: ["Show customer journey", "Highlight unique features", "Include conversion metrics"],
      },
      {
        title: "Business Model & Unit Economics",
        content:
          "Revenue streams: [%] product sales (margin: [%]), [%] marketplace fees ([%] take rate). Unit economics: $[AOV] AOV, $[CAC] CAC, $[LTV] LTV ([ratio] LTV:CAC).",
        tips: ["Show multiple revenue streams", "Include unit economics", "Demonstrate profitability path"],
      },
      {
        title: "Supply Chain & Operations",
        content:
          "Supply chain: [sourcing strategy] with [number] suppliers in [regions]. Fulfillment: [approach] with [delivery time] average delivery and [%] on-time rate.",
        tips: ["Show supply chain advantages", "Highlight operational efficiency", "Include delivery metrics"],
      },
      {
        title: "Traction & Growth Metrics",
        content:
          "Current metrics: $[GMV] monthly GMV, [number] customers, [%] repeat purchase rate, [%] monthly growth. Customer metrics: $[AOV] AOV, [frequency] purchase frequency.",
        tips: ["Lead with GMV growth", "Show customer retention", "Include engagement metrics"],
      },
      {
        title: "Marketing & Customer Acquisition",
        content:
          "Acquisition channels: [Channel 1] ($[CAC], [%] of customers), [Channel 2] ($[CAC], [%] of customers). Brand building through [strategy] with [engagement metrics].",
        tips: ["Show diversified acquisition", "Include channel economics", "Highlight brand building"],
      },
      {
        title: "Competition & Differentiation",
        content:
          "We compete with [Competitor 1] ([weakness]), [Competitor 2] ([limitation]), and traditional retail ([disadvantage]). Our moat: [sustainable advantage].",
        tips: ["Show competitive positioning", "Highlight sustainable advantages", "Address traditional retail"],
      },
      {
        title: "Financial Projections",
        content:
          "Projecting $[revenue] revenue by Year 3 with [%] gross margins. Growth drivers: [customers] customers at $[AOV] AOV with [%] repeat rate.",
        tips: ["Show realistic growth", "Include margin expansion", "Highlight growth drivers"],
      },
      {
        title: "Funding Ask",
        content:
          "Raising $[amount] for [inventory/working capital], [marketing/customer acquisition], and [geographic/category expansion]. Target: $[GMV] GMV and [customers] customers by [timeline].",
        tips: ["Show capital efficiency", "Tie to growth milestones", "Include expansion plans"],
      },
    ],
  },

  ai: {
    name: "AI & Machine Learning",
    description: "Artificial intelligence, machine learning, and data science companies",
    keyMetrics: ["Model Performance", "Data Quality", "Inference Speed", "Training Costs", "Accuracy Metrics"],
    focusAreas: ["Technical Differentiation", "Data Advantage", "Model Performance", "Scalability", "AI Ethics"],
    slides: [
      {
        title: "Company Overview",
        content:
          "We're building AI-powered [solution] that enables [target users] to [key capability] with [performance metric] accuracy/speed/efficiency improvement over current methods.",
        tips: ["Lead with AI capability", "Quantify performance gains", "Show clear use case"],
      },
      {
        title: "Problem & AI Opportunity",
        content:
          "Current [process/decision] relies on [manual/legacy approach] resulting in [inefficiency/error rate]. AI can solve this by [capability] but existing solutions lack [limitation].",
        tips: ["Show AI-solvable problem", "Highlight current limitations", "Demonstrate AI advantage"],
      },
      {
        title: "AI Solution & Technology",
        content:
          "Our [AI approach] uses [technical method] trained on [data description] to achieve [performance metric]. Key innovations: [innovation 1], [innovation 2], [innovation 3].",
        tips: ["Explain AI approach clearly", "Highlight technical innovations", "Show performance metrics"],
      },
      {
        title: "Data Advantage",
        content:
          "Our dataset: [size/quality] of [data type] with [unique characteristics]. Data sources: [source 1], [source 2]. Data moat: [competitive advantage] creates [barrier to entry].",
        tips: ["Show data quality and size", "Highlight unique data sources", "Explain data moat"],
      },
      {
        title: "Model Performance",
        content:
          "Performance metrics: [accuracy]% accuracy ([benchmark] baseline), [speed] inference time, [cost] per prediction. Validation: [validation method] on [test set description].",
        tips: ["Include key performance metrics", "Compare to benchmarks", "Show validation rigor"],
      },
      {
        title: "Market Opportunity",
        content:
          "AI in [industry] market: $[size] growing [%] annually. Our addressable market: [use cases] representing $[TAM] opportunity driven by [adoption trend].",
        tips: ["Size AI market opportunity", "Show adoption trends", "Identify specific use cases"],
      },
      {
        title: "Product & Integration",
        content:
          "Deployment options: [API/SDK/Platform] with [integration method]. User workflow: [input] → [AI processing] → [output/action]. Performance: [latency] response time.",
        tips: ["Show integration simplicity", "Highlight user workflow", "Include performance specs"],
      },
      {
        title: "Business Model",
        content:
          "Pricing: $[price] per [unit/prediction/user] with [pricing tiers]. Revenue streams: [%] usage-based, [%] subscription, [%] professional services.",
        tips: ["Show scalable pricing model", "Include multiple revenue streams", "Demonstrate unit economics"],
      },
      {
        title: "Traction & Validation",
        content:
          "Current traction: [customers] customers, [usage metric] monthly predictions/users, [growth rate]% monthly growth. Customer results: [outcome 1], [outcome 2].",
        tips: ["Show usage metrics", "Include customer outcomes", "Highlight growth trajectory"],
      },
      {
        title: "AI Ethics & Governance",
        content:
          "AI governance: [bias mitigation], [explainability features], [privacy protection]. Compliance: [regulations] compliant with [audit/certification] validation.",
        tips: ["Address AI ethics proactively", "Show bias mitigation", "Highlight compliance measures"],
      },
      {
        title: "Technical Roadmap",
        content:
          "Roadmap: [capability 1] by [timeline], [capability 2] by [timeline]. R&D focus: [research area 1], [research area 2]. Technical milestones: [milestone] by [date].",
        tips: ["Show technical evolution", "Highlight R&D priorities", "Include realistic timelines"],
      },
      {
        title: "Funding Ask",
        content:
          "Raising $[amount] for [R&D/talent], [data acquisition], and [infrastructure scaling]. Goals: [performance improvement], [market expansion], [technical milestone].",
        tips: ["Show R&D investment needs", "Tie to technical milestones", "Highlight talent requirements"],
      },
    ],
  },
}

export function getIndustryTemplate(industry: string): IndustryTemplate {
  return industryTemplates[industry.toLowerCase()] || industryTemplates.saas
}

export function getIndustryList(): Array<{ key: string; name: string; description: string }> {
  return Object.entries(industryTemplates).map(([key, template]) => ({
    key,
    name: template.name,
    description: template.description,
  }))
}
