import type { NextRequest } from "next/server"

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const { slides, deckTitle, format } = await req.json()

    if (format === "pptx") {
      // Generate PowerPoint content
      const pptxContent = generatePowerPointXML(slides, deckTitle)

      return new Response(pptxContent, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "Content-Disposition": `attachment; filename="${deckTitle.replace(/[^a-zA-Z0-9]/g, "_")}.pptx"`,
        },
      })
    } else if (format === "pdf") {
      // Generate PDF content
      const pdfContent = generatePDFContent(slides, deckTitle)

      return new Response(pdfContent, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${deckTitle.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`,
        },
      })
    }

    return Response.json({ error: "Invalid format" }, { status: 400 })
  } catch (error) {
    console.error("Export error:", error)
    return Response.json({ error: "Failed to export presentation" }, { status: 500 })
  }
}

function generatePowerPointXML(slides: any[], deckTitle: string): string {
  // Basic PowerPoint XML structure
  const slideXML = slides
    .map(
      (slide, index) => `
    <slide>
      <title>${escapeXML(slide.title)}</title>
      <content>${escapeXML(slide.content)}</content>
      <slideNumber>${index + 1}</slideNumber>
    </slide>
  `,
    )
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<presentation title="${escapeXML(deckTitle)}">
  <slides>
    ${slideXML}
  </slides>
</presentation>`
}

function generatePDFContent(slides: any[], deckTitle: string): string {
  // Basic PDF-like content (this would need a proper PDF library in production)
  const content = slides
    .map(
      (slide, index) => `
SLIDE ${index + 1}: ${slide.title}
${"=".repeat(50)}

${slide.content}

${"-".repeat(50)}
`,
    )
    .join("\n\n")

  return `${deckTitle}
${"=".repeat(deckTitle.length)}

${content}`
}

function escapeXML(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
