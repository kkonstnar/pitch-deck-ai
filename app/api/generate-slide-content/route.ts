import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

export const maxDuration = 30

const SlideContentSchema = z.object({
  title: z.string(),
  content: z.string(),
  suggestedImages: z.array(z.string()).optional(),
  keyPoints: z.array(z.string()).optional(),
  speakerNotes: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const { slideType, currentTitle, currentContent, deckContext } = await req.json()
    
    // Force load API key from .env.local if not in environment
    if (!process.env.OPENAI_API_KEY) {
      try {
        const fs = require('fs')
        const path = require('path')
        const envPath = path.join(process.cwd(), '.env.local')
        const envContent = fs.readFileSync(envPath, 'utf8')
        const lines = envContent.split('\n')
        const openaiLine = lines.find((line: string) => line.startsWith('OPENAI_API_KEY='))
        if (openaiLine) {
          process.env.OPENAI_API_KEY = openaiLine.split('=')[1]
        }
      } catch (error) {
        console.log("Error loading .env.local:", (error as Error).message)
      }
    }

    if (!process.env.OPENAI_API_KEY) {
      // Mock response with enhanced content
      return Response.json({
        title: `Enhanced ${currentTitle}`,
        content: `${currentContent}\n\n• Market-leading solution with proven ROI\n• Scalable technology platform serving 10,000+ customers\n• Strategic partnerships with industry leaders\n• Projected 300% revenue growth over next 24 months\n• Award-winning team with 50+ years combined experience`,
        suggestedImages: [
          "Professional team photo with diverse backgrounds",
          "Clean data visualization showing growth metrics",
          "Modern office or product interface screenshot"
        ],
        keyPoints: [
          "Emphasize quantifiable results and metrics",
          "Highlight competitive advantages and moats",
          "Address potential investor concerns proactively",
          "Connect to broader market trends and opportunities"
        ],
        speakerNotes: "Focus on the most compelling data points that demonstrate traction and potential. Be prepared to discuss the assumptions behind projections and provide supporting evidence for claims."
      })
    }

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: SlideContentSchema,
      prompt: `Enhance this pitch deck slide with compelling, investor-focused content. 

IMPORTANT FORMATTING RULES:
- DO NOT use markdown formatting like **bold** or *italic* 
- DO NOT use asterisks (*) or underscores (_) for emphasis
- Use plain text with bullet points (•) for structure
- Use UPPERCASE for emphasis when needed
- Use numbers and percentages to highlight key metrics

Slide Type: ${slideType}
Current Title: ${currentTitle}
Current Content: ${currentContent}

Deck Context: ${deckContext.map((s: any) => `${s.title} (${s.type})`).join(", ")}

Requirements:
- Create compelling, investor-focused content with specific metrics and data points
- Use bullet points (•) and clear formatting for readability
- Include quantifiable results, growth rates, and financial projections where relevant
- Address potential investor concerns and questions
- Ensure content flows logically with other slides in the deck
- Keep tone professional but engaging
- Include clear value propositions and competitive advantages
- Make content comprehensive (300+ words) with detailed explanations

For the enhanced response, provide:
1. An improved, attention-grabbing title (no markdown formatting)
2. Detailed, metric-driven content with bullet points (minimum 300 words)
3. 2-3 specific image suggestions that would enhance this slide
4. 3-4 key talking points for the presenter
5. Speaker notes with additional context and potential Q&A preparation

Example good content structure:
MARKET OPPORTUNITY ANALYSIS

• Total Addressable Market (TAM) of $47.2B growing at 18.5% CAGR
• Serviceable Addressable Market (SAM) of $12.8B with clear expansion paths
• Early adopters showing 65% productivity gains and 40% cost reduction
• Competitive landscape fragmented with no dominant player capturing more than 8% market share

Make this slide compelling enough to capture investor attention and demonstrate clear business value.`,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Generate slide content error:", error)
    return Response.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
