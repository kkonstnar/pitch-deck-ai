import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      // Fallback to mock response if no API key
      const mockResponse =
        "I'd love to help you create a compelling pitch deck! To get started, can you tell me about your startup? What industry are you in and what problem does it solve?"

      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          const words = mockResponse.split(" ")
          let wordIndex = 0

          const sendNextChunk = () => {
            if (wordIndex < words.length) {
              const chunk = words[wordIndex] + " "
              controller.enqueue(encoder.encode(`data: {"choices":[{"delta":{"content":"${chunk}"}}]}\n\n`))
              wordIndex++
              setTimeout(sendNextChunk, 50)
            } else {
              controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
              controller.close()
            }
          }
          sendNextChunk()
        },
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      })
    }

    // Use GPT-4o-mini (cheapest OpenAI model)
    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: `You are a pitch deck assistant specializing in creating industry-specific investor presentations.

CONVERSATION FLOW:
1. Identify the user's industry (SaaS, Fintech, Healthcare, E-commerce, AI/ML, etc.)
2. Ask targeted questions based on their industry
3. When ready to generate, use the GENERATE_DECK command with industry-specific content

AVAILABLE INDUSTRIES & KEY FOCUS AREAS:
- SaaS: MRR/ARR, churn, CAC/LTV, product-market fit, scalability
- Fintech: Transaction volume, regulatory compliance, security, partnerships
- Healthcare: Clinical outcomes, regulatory pathway, patient impact, safety
- E-commerce: GMV, conversion rates, supply chain, customer experience
- AI/ML: Model performance, data advantage, technical differentiation

WHEN USER ASKS TO GENERATE THE DECK:
Respond with: "I'll create your [INDUSTRY] pitch deck now! 🚀" followed by:
GENERATE_DECK:
{
  "industry": "[detected_industry]",
  "title": "Company Name - [Industry] Investor Pitch",
  "description": "Brief description tailored to industry",
  "slides": [
    {
      "title": "Industry-specific slide title",
      "content": "Detailed content with industry-specific metrics and language"
    }
  ]
}

TONE:
- Professional and industry-aware
- Ask industry-specific questions
- Use relevant terminology and metrics
- Focus on what investors in that industry care about

Tailor your questions and advice to the specific industry context.`,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API Error:", error)
    return new Response("Error processing request", { status: 500 })
  }
}
