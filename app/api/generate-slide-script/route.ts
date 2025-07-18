import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

export const maxDuration = 30

const SlideScriptSchema = z.object({
  script: z.string(),
})

export async function POST(req: Request) {
  try {
    const { slide, style, context } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      // Mock response
      return Response.json({
        script: `For the "${slide.title}" slide: Start by introducing the key concept, then elaborate on the main points from your slide content. Remember to pause for emphasis and engage with your audience.`,
      })
    }

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: SlideScriptSchema,
      prompt: `Create a presentation script for this specific slide.

Slide Title: ${slide.title}
Slide Type: ${slide.type}
Slide Content: ${slide.content}
Presentation Style: ${style}

Deck Context: ${context.map((s: any) => `${s.title} (${s.type})`).join(", ")}

Requirements:
- Create a natural speaking script for this slide
- Include transitions from the previous slide concept
- Add emphasis points and pauses
- Make it engaging and conversational
- Include timing cues
- Address the key points from the slide content
- Keep it concise but impactful (1-2 minutes of speaking)

Return just the speaking script for this slide.`,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Generate slide script error:", error)
    return Response.json({ error: "Failed to generate script" }, { status: 500 })
  }
}
