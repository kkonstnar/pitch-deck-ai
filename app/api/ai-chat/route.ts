import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

export const maxDuration = 30

const ChatResponseSchema = z.object({
  response: z.string(),
  updatedSlide: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    suggestedImages: z.array(z.string()).optional(),
    speakerNotes: z.string().optional(),
  }).optional(),
})

export async function POST(req: Request) {
  try {
    const { messages, currentSlide, deckContext, userRequest } = await req.json()
    
    // Check if API key is available (removed fs dependency for production)
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY not found in environment variables")
      return Response.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    if (!process.env.OPENAI_API_KEY) {
      // Mock response for testing
      return Response.json({
        response: `I can help you improve your "${currentSlide.title}" slide! Here are some suggestions:

• Add more specific metrics and data points
• Include industry benchmarks for credibility
• Strengthen the value proposition with quantifiable benefits
• Add compelling visuals and charts

Would you like me to rewrite the content with these improvements?`,
        updatedSlide: userRequest.toLowerCase().includes("rewrite") || userRequest.toLowerCase().includes("improve") ? {
          content: `${currentSlide.content}\n\n• Enhanced with specific metrics and data points\n• Industry benchmarks and competitive analysis\n• Quantifiable benefits and ROI calculations\n• Strategic positioning and market opportunity`,
          suggestedImages: [
            "Professional data visualization charts",
            "Industry comparison infographics", 
            "ROI calculation screenshots"
          ],
          speakerNotes: "Focus on the enhanced metrics and be prepared to discuss the underlying assumptions and data sources."
        } : undefined
      })
    }

    // Get conversation history
    const conversationHistory = messages.slice(-5).map((msg: any) => 
      `${msg.role}: ${msg.content}`
    ).join("\n")

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: ChatResponseSchema,
      prompt: `You are an expert pitch deck consultant helping to improve a specific slide. 

CURRENT SLIDE DETAILS:
Title: ${currentSlide.title}
Type: ${currentSlide.type}
Current Content: ${currentSlide.content}
Current Images: ${currentSlide.suggestedImages?.join(", ") || "None"}
Current Speaker Notes: ${currentSlide.speakerNotes || "None"}

DECK CONTEXT:
Other slides in deck: ${deckContext.map((s: any) => `${s.title} (${s.type})`).join(", ")}

CONVERSATION HISTORY:
${conversationHistory}

USER REQUEST: ${userRequest}

FORMATTING RULES:
- DO NOT use markdown formatting like **bold** or *italic*
- DO NOT use asterisks (*) or underscores (_) for emphasis
- Use plain text with bullet points (•) for structure
- Use UPPERCASE for emphasis when needed
- Use numbers and percentages to highlight key metrics

Based on the user's request, provide:
1. A helpful response explaining what you can do or what you've improved
2. If the user wants content improvements, provide updatedSlide with:
   - Enhanced title (if needed)
   - Improved content with specific metrics, data points, and detailed explanations (300+ words)
   - 2-3 specific image suggestions
   - Detailed speaker notes with talking points and Q&A preparation

Focus on making the slide more compelling, data-driven, and investor-ready. Address the user's specific request while maintaining professional quality.`,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("AI chat error:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}