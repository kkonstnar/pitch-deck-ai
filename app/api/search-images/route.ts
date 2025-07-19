import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

export const maxDuration = 30

const ImageSearchSchema = z.object({
  images: z.array(z.object({
    description: z.string(),
    searchTerms: z.array(z.string()),
    type: z.enum(["chart", "diagram", "photo", "icon", "infographic", "screenshot"]),
    stockPhotoUrl: z.string().optional(),
    iconSuggestion: z.string().optional(),
  }))
})

export async function POST(req: Request) {
  try {
    const { query, slideType, slideTitle, slideContent } = await req.json()
    
    // Check if API key is available (removed fs dependency for production)
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY not found in environment variables")
      // Return mock response instead of error to keep app functional
      return Response.json({
        images: [
          {
            description: "Professional business growth chart showing upward trend",
            searchTerms: ["business growth", "upward trend", "success chart"],
            type: "chart",
            stockPhotoUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
            iconSuggestion: "📈 TrendingUp icon from Lucide React"
          },
          {
            description: "Modern team collaboration workspace",
            searchTerms: ["team collaboration", "modern office", "workspace"],
            type: "photo",
            stockPhotoUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
            iconSuggestion: "👥 Users icon from Lucide React"
          },
          {
            description: "Clean data visualization dashboard",
            searchTerms: ["dashboard", "analytics", "data visualization"],
            type: "screenshot",
            stockPhotoUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
            iconSuggestion: "📊 BarChart icon from Lucide React"
          }
        ]
      })
    }

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: ImageSearchSchema,
      prompt: `Find 3-5 relevant images for a pitch deck slide based on this information:

Query: ${query}
Slide Type: ${slideType}
Slide Title: ${slideTitle}
Slide Content: ${slideContent}

For each image, provide:
1. A detailed description of what the image should show
2. 3-5 search terms for finding this image on stock photo sites
3. The type of visual (chart, diagram, photo, icon, infographic, screenshot)
4. A suggested Unsplash URL with proper format: https://images.unsplash.com/photo-[ID]?w=800&q=80
5. A suggested Lucide React icon with emoji if applicable

Focus on:
- Professional, investor-ready visuals
- Charts and data visualizations for metrics
- Clean, modern design aesthetic
- Relevant industry imagery
- Icons that enhance understanding

IMPORTANT: For stockPhotoUrl, use verified Unsplash photo IDs:
- Business charts: photo-1611974789855-9c2a0a7236a3
- Team collaboration: photo-1600880292203-757bb62b4baf
- Data visualization: photo-1551288049-bebda4e38f71
- Growth charts: photo-1590283603385-17ffb3a7f29f
- Technology/AI: photo-1485827404703-89b55fcc595e
- Market analysis: photo-1460925895917-afdab827c52f

Make suggestions specific and actionable for creating professional pitch deck visuals.`,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Image search error:", error)
    return Response.json({ error: "Failed to search images" }, { status: 500 })
  }
}