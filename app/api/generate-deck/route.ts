import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"
import { getIndustryTemplate } from "@/lib/pitch-templates"

export const maxDuration = 30

const PitchDeckSchema = z.object({
  title: z.string(),
  description: z.string(),
  industry: z.string(),
  slides: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
      suggestedImages: z.array(z.string()).optional(),
      keyMetrics: z.array(z.string()).optional(),
      speakerNotes: z.string().optional(),
    }),
  ),
})

export async function POST(req: Request) {
  try {
    const { businessDescription, stage, industry, fundingType, conversationContext } = await req.json()
    
    // Debug logging
    console.log("🔑 OpenAI API Key present:", !!process.env.OPENAI_API_KEY)
    console.log("🔑 API Key length:", process.env.OPENAI_API_KEY?.length || 0)
    
    // Check if API key is available (removed fs dependency for production)
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY not found in environment variables")
      return Response.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    if (!process.env.OPENAI_API_KEY) {
      // Enhanced mock response with comprehensive content
      const template = getIndustryTemplate(industry || "saas")
      const companyName = businessDescription.split(" ")[0] || "Demo"
      
      // Generate detailed, industry-specific content
      const enhancedSlides = template.slides.slice(0, 12).map((slide, index) => {
        let detailedContent = slide.content
          .replace(/\[Company Name\]/g, companyName)
          .replace(/\[([^\]]+)\]/g, "$1")
        
        // Add comprehensive, slide-specific content
        switch(slide.title.toLowerCase()) {
          case 'problem statement':
            detailedContent += `\n\n📊 Key Problem Metrics:\n• 73% of ${template.name.toLowerCase()} users report inefficiencies with current solutions\n• $127B annual market inefficiency due to outdated tools\n• Average 32% productivity loss from poor workflows\n• 85% of teams struggle with fragmented data systems\n\n🎯 Pain Points:\n• Lack of real-time insights and predictive analytics\n• Manual processes consuming 40% of team time\n• Integration challenges across 15+ tools per organization\n• Compliance and security concerns with legacy systems`
            break
          case 'solution overview':
            detailedContent += `\n\n🚀 Core Solution Features:\n• AI-powered predictive analytics with 94% accuracy\n• Automated workflow optimization reducing manual work by 60%\n• Enterprise-grade security with SOC 2 Type II compliance\n• Seamless integration with 200+ popular business tools\n\n💡 Key Differentiators:\n• Patent-pending ML algorithms for industry-specific optimization\n• Real-time collaboration tools with 99.9% uptime SLA\n• Advanced reporting suite with customizable dashboards\n• Mobile-first design supporting offline functionality`
            break
          case 'market opportunity':
            detailedContent += `\n\n📈 Market Size & Growth:\n• Total Addressable Market (TAM): $87.5B by 2025\n• Serviceable Addressable Market (SAM): $23.2B\n• Serviceable Obtainable Market (SOM): $1.8B\n• Market growing at 15.3% CAGR (2023-2028)\n\n🌍 Geographic Expansion:\n• North America: $34.5B market opportunity\n• Europe: $21.8B market opportunity\n• Asia-Pacific: $18.7B market opportunity\n• Target 250,000+ potential enterprise customers globally`
            break
          case 'business model':
            detailedContent += `\n\n💰 Revenue Streams:\n• SaaS Subscriptions (85%): $29-$299/month per user\n• Enterprise Licenses (12%): $50K-$500K annual contracts\n• Professional Services (3%): Implementation & training\n\n📊 Unit Economics:\n• Average Revenue Per User (ARPU): $1,680/year\n• Customer Acquisition Cost (CAC): $420\n• Customer Lifetime Value (CLV): $8,950\n• CLV/CAC Ratio: 21.3x (industry benchmark: 3x)\n• Gross Margin: 87% (software standard: 75-85%)`
            break
          case 'traction & metrics':
            detailedContent += `\n\n🏆 Growth Metrics:\n• Monthly Recurring Revenue (MRR): $485K (+67% QoQ)\n• Annual Recurring Revenue (ARR): $5.8M run rate\n• Customer Count: 2,847 active subscribers\n• Monthly Active Users (MAU): 34,500 (+45% MoM)\n• Net Revenue Retention (NRR): 127%\n\n⭐ Customer Success:\n• Net Promoter Score (NPS): 72 (industry avg: 31)\n• Customer Satisfaction (CSAT): 4.8/5.0\n• Churn Rate: 3.2% monthly (industry avg: 5.8%)\n• Fortune 500 customers: 23 companies\n• Case studies showing 40-65% productivity gains`
            break
          case 'team':
            detailedContent += `\n\n👥 Leadership Team:\n• CEO: Former VP at [Industry Leader], 15+ years experience\n• CTO: Ex-Senior Engineer at Google, PhD in AI/ML\n• VP Sales: Previous $50M+ ARR at enterprise software company\n• VP Marketing: Former CMO at successful B2B SaaS exit\n\n🎓 Team Expertise:\n• 45 full-time employees across engineering, sales, marketing\n• 67% technical team with expertise in AI/ML, cloud architecture\n• Advisory board includes 3 industry veterans and 2 successful entrepreneurs\n• Proven track record: 2 successful exits, 1 IPO among leadership`
            break
          case 'financial projections':
            detailedContent += `\n\n📊 5-Year Financial Forecast:\n• Year 1: $8.2M ARR (42% growth)\n• Year 2: $18.5M ARR (125% growth)\n• Year 3: $35.8M ARR (93% growth)\n• Year 4: $62.1M ARR (73% growth)\n• Year 5: $98.7M ARR (59% growth)\n\n💡 Key Assumptions:\n• Customer acquisition rate: 350 new customers/month by Year 3\n• Average contract value increase: 15% annually\n• International expansion: 40% of revenue by Year 4\n• Gross margin improvement: 87% → 91% by Year 5\n• Operating margin: Break-even by Month 18, 25% by Year 5`
            break
          case 'funding ask':
            detailedContent += `\n\n💰 Funding Requirements:\n• Total Raise: $8.5M Series A\n• Use of Funds Breakdown:\n  - Product Development (40%): $3.4M\n  - Sales & Marketing (35%): $3.0M\n  - Team Expansion (20%): $1.7M\n  - Operations & Legal (5%): $0.4M\n\n🎯 Key Milestones (Next 18 Months):\n• Reach $15M ARR with 5,000+ customers\n• Launch enterprise tier with advanced analytics\n• Expand to European market with localized offerings\n• Build strategic partnerships with 3 major platforms\n• Achieve positive cash flow by Month 15`
            break
          default:
            detailedContent += `\n\n📋 Key Highlights:\n• Industry-leading performance metrics\n• Proven scalability and market validation\n• Strong competitive positioning\n• Clear path to profitability\n\n🔍 Supporting Evidence:\n• Third-party validation and awards\n• Customer testimonials and case studies\n• Market research and analyst reports\n• Competitive analysis and benchmarking`
        }
        
        // Generate slide-specific image suggestions
        const getSlideImages = (title: string) => {
          switch(title.toLowerCase()) {
            case 'problem statement':
              return [
                "📊 Market research infographic showing industry pain points",
                "📈 Chart displaying productivity losses and inefficiencies",
                "🔍 Before/after comparison of current vs. ideal workflow"
              ]
            case 'solution overview':
              return [
                "🖥️ Product interface screenshots showing key features",
                "⚙️ Architecture diagram of AI-powered solution",
                "🔄 Workflow automation process visualization"
              ]
            case 'market opportunity':
              return [
                "🌍 Global market size visualization with geographic breakdown",
                "📊 Market growth trends and projections chart",
                "📈 TAM/SAM/SOM market sizing funnel diagram"
              ]
            case 'business model':
              return [
                "💰 Revenue streams breakdown pie chart",
                "📊 Pricing tiers and feature comparison table",
                "📈 Unit economics and LTV/CAC calculations"
              ]
            case 'traction & metrics':
              return [
                "📈 Growth metrics dashboard with MRR/ARR trends",
                "⭐ Customer satisfaction scores and NPS results",
                "🏆 Customer logos and testimonials showcase"
              ]
            case 'team':
              return [
                "👥 Professional team photos with LinkedIn profiles",
                "🎓 Team expertise and background highlights",
                "🏢 Organizational chart with key roles"
              ]
            case 'financial projections':
              return [
                "📊 5-year revenue and growth projections chart",
                "💰 Cash flow and burn rate analysis",
                "📈 Key financial metrics and ratios table"
              ]
            case 'funding ask':
              return [
                "💰 Use of funds breakdown pie chart",
                "🎯 Milestone timeline with key deliverables",
                "📊 ROI projections for investors"
              ]
            default:
              return [
                "📊 Professional charts and data visualizations",
                "🎯 Strategic diagrams and process flows",
                "💡 Product mockups and interface designs"
              ]
          }
        }
        
        return {
          title: slide.title,
          content: detailedContent,
          suggestedImages: getSlideImages(slide.title),
          keyMetrics: template.keyMetrics.slice(0, 3),
          speakerNotes: `${slide.tips.join(". ")}. Focus on the quantifiable impact and competitive advantages. Be prepared to discuss underlying assumptions and provide supporting evidence for all claims. Address potential investor concerns proactively and highlight the scalability of the solution.`
        }
      })
      
      return Response.json({
        title: `${companyName} - ${template.name} Pitch Deck`,
        description: `A comprehensive ${stage} stage ${template.name.toLowerCase()} pitch deck with detailed market analysis, financial projections, and growth strategy`,
        industry: industry || "saas",
        slides: enhancedSlides,
      })
    }

    const template = getIndustryTemplate(industry || "saas")

    // Use GPT-4o-mini (cheapest OpenAI model)
    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: PitchDeckSchema,
      prompt: `Create a comprehensive, investor-ready ${template.name} pitch deck for a ${stage} stage company with detailed content, metrics, and visual suggestions.

Business Description: ${businessDescription}
Industry: ${template.name}
Funding Type: ${fundingType}
Conversation Context: ${conversationContext}

INDUSTRY-SPECIFIC REQUIREMENTS:
Key Metrics to Include: ${template.keyMetrics.join(", ")}
Focus Areas: ${template.focusAreas.join(", ")}

Use this industry template structure but customize content based on the business description:
${template.slides.map((slide, i) => `${i + 1}. ${slide.title}: ${slide.tips.join("; ")}`).join("\n")}

Generate 10-12 slides with compelling, data-driven content that tells a cohesive investment story. 

CONTENT REQUIREMENTS:
- Use specific metrics, percentages, and quantifiable data points
- Include industry benchmarks and market comparisons
- Address potential investor concerns proactively
- Highlight sustainable competitive advantages
- Focus on the metrics that matter most in ${template.name}
- Use bullet points for clarity and readability
- Include realistic but ambitious projections

For each slide, provide:
1. Compelling, specific title
2. Detailed content with bullet points and metrics
3. 2-3 specific image suggestions (charts, screenshots, photos, etc.)
4. 2-3 key metrics relevant to this slide type
5. Speaker notes with talking points and potential Q&A preparation

Make this deck comprehensive enough to secure investor meetings and demonstrate clear business value.`,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Generate deck error:", error)
    return Response.json({ error: "Failed to generate deck" }, { status: 500 })
  }
}
