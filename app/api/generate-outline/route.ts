import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"
import { getIndustryTemplate } from "@/lib/pitch-templates"

export const maxDuration = 30

const PitchOutlineSchema = z.object({
  title: z.string(),
  description: z.string(),
  industry: z.string(),
  slides: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
      suggestedImages: z.array(z.string()),
      speakerNotes: z.string(),
    }),
  ),
})

export async function POST(req: Request) {
  try {
    const {
      companyName,
      industry,
      problemStatement,
      solution,
      businessModel,
      financials,
      targetMarket,
      competitiveAdvantage,
      teamBackground,
      fundingAmount,
    } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      // Mock response using industry template
      const template = getIndustryTemplate(industry || "saas")
      return Response.json({
        title: `${companyName} - ${template.name} Investor Pitch`,
        description: `${companyName} is solving ${problemStatement} with ${solution}`,
        industry: industry || "saas",
        slides: template.slides.map((slide, index) => ({
          title: slide.title,
          content: slide.content
            .replace(/\[Company Name\]/g, companyName)
            .replace(/\[specific pain point\]/g, problemStatement)
            .replace(/\[unique approach\]/g, solution)
            .replace(/\[revenue model\]/g, businessModel),
          suggestedImages: [
            "Chart showing market growth",
            "Product screenshot",
            "Team photo",
            "Financial projections graph",
          ][index % 4]
            ? [
                `${["Chart showing market growth", "Product screenshot", "Team photo", "Financial projections graph"][index % 4]}`,
              ]
            : ["Relevant infographic"],
          speakerNotes: `Key talking points for ${slide.title}: ${slide.tips.join(". ")}`,
        })),
      })
    }

    const template = getIndustryTemplate(industry || "saas")

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: PitchOutlineSchema,
      prompt: `Create a comprehensive pitch deck outline for ${companyName} in the ${industry} industry.

COMPANY DETAILS:
- Company Name: ${companyName}
- Industry: ${industry}
- Problem Statement: ${problemStatement}
- Solution: ${solution}
- Business Model: ${businessModel}
- Target Market: ${targetMarket}
- Competitive Advantage: ${competitiveAdvantage}
- Team Background: ${teamBackground}
- Funding Amount: ${fundingAmount}
- Financial Info: ${financials}

INDUSTRY TEMPLATE (${template.name}):
Key Metrics: ${template.keyMetrics.join(", ")}
Focus Areas: ${template.focusAreas.join(", ")}

Create 10-12 slides with:
1. Compelling titles that tell a story
2. Detailed content that incorporates the provided company information
3. Suggested images for each slide (be specific about what type of visual would work best)
4. Speaker notes with key talking points

Make each slide:
- Specific to ${companyName} and their unique situation
- Tailored to ${industry} investors and their concerns
- Include relevant metrics and data points
- Tell a cohesive story from problem to solution to opportunity
- Address the key focus areas: ${template.focusAreas.join(", ")}

Ensure the content flows logically and builds a compelling investment case.`,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Generate outline error:", error)
    return Response.json({ error: "Failed to generate outline" }, { status: 500 })
  }
}
