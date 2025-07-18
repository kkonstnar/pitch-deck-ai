export async function POST(req: Request) {
  try {
    const { format, slides, deckTitle, deckDescription } = await req.json()
    
    if (format === 'pdf') {
      // For PDF, we'll return the slide data to be processed on the client side
      // This is because jsPDF works better in the browser environment
      return Response.json({
        success: true,
        message: "PDF generation should be handled client-side",
        slides,
        deckTitle,
        deckDescription
      })
    }
    
    if (format === 'pptx') {
      // For PPTX, we'll return the slide data for client-side processing
      // pptxgenjs works well in the browser
      return Response.json({
        success: true,
        message: "PPTX generation should be handled client-side",
        slides,
        deckTitle,
        deckDescription
      })
    }
    
    return Response.json({ error: "Unsupported format" }, { status: 400 })
  } catch (error) {
    console.error("Export error:", error)
    return Response.json({ error: "Export failed" }, { status: 500 })
  }
}