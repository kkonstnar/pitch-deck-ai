import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

export const maxDuration = 30

const ScriptSchema = z.object({
  script: z.string(),
  slideScripts: z.record(z.string()).optional().default({}),
})

export async function POST(req: Request) {
  try {
    const { slides, style, length, deckTitle } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      // Mock response
      const mockScript = `Welcome everyone, and thank you for your time today.

I'm excited to share ${deckTitle} with you - a company that's solving a critical problem in the market.

[Continue with your presentation following the slides...]

Let me walk you through our journey and the opportunity ahead.`

      const mockSlideScripts: Record<string, string> = {}
      slides.forEach((slide: any, index: number) => {
        mockSlideScripts[`slide_${index}`] = `For slide "${slide.title}": ${slide.content.substring(0, 100)}...`
      })

      return Response.json({
        script: mockScript,
        slideScripts: mockSlideScripts,
      })
    }

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: ScriptSchema,
      prompt: `Create a compelling ${length}-minute presentation script for "${deckTitle}".

Style: ${style}
Target Length: ${length} minutes (~${length * 150} words)

Slides:
${slides.map((slide: any, index: number) => `${index + 1}. ${slide.title} (${slide.type}): ${slide.content}`).join("\n")}

Requirements:
- Create a natural, flowing narrative that connects all slides
- Include smooth transitions between slides
- Add timing cues and speaking notes
- Match the specified presentation style
- Include pauses, emphasis points, and audience engagement moments
- Make it sound conversational and confident
- Address potential investor questions proactively
- End with a strong call to action

Also create individual slide scripts in the slideScripts object with keys as slide indices.`,
    })

    // Make sure slideScripts is always present to keep the client happy
    const safeObject = {
      ...result.object,
      slideScripts: result.object.slideScripts ?? {},
    }
    return Response.json(safeObject)
  } catch (error) {
    console.error("Generate script error:", error)
    return Response.json({ error: "Failed to generate script" }, { status: 500 })
  }
}
