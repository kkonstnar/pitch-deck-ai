"use client"

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface Slide {
  id: string
  type: string
  title: string
  content: string
  suggestedImages?: string[]
  speakerNotes?: string
  mediaUrls?: string[]
  mediaDescriptions?: string[]
}

export async function exportToPDF(slides: Slide[], deckTitle: string, deckDescription?: string) {
  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4'
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 40
    const contentWidth = pageWidth - 2 * margin
    const contentHeight = pageHeight - 2 * margin

    // Title page
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text(deckTitle, pageWidth / 2, 100, { align: 'center' })
    
    if (deckDescription) {
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'normal')
      const descLines = pdf.splitTextToSize(deckDescription, contentWidth)
      pdf.text(descLines, pageWidth / 2, 140, { align: 'center' })
    }

    pdf.setFontSize(12)
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 60, { align: 'center' })

    // Add slides
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]
      pdf.addPage()
      
      // Slide number
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`${i + 1} / ${slides.length}`, pageWidth - margin, 30, { align: 'right' })
      
      // Slide title
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text(slide.title, margin, 80)
      
      // Slide content
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      
      // Process content to handle bullet points
      const processedContent = slide.content
        .replace(/•/g, '• ')
        .replace(/\n\n/g, '\n')
      
      const contentLines = pdf.splitTextToSize(processedContent, contentWidth)
      let yPosition = 120
      
      for (const line of contentLines) {
        if (yPosition > pageHeight - margin - 60) {
          pdf.addPage()
          yPosition = 80
          
          // Repeat slide title on continuation page
          pdf.setFontSize(16)
          pdf.setFont('helvetica', 'bold')
          pdf.text(`${slide.title} (continued)`, margin, 40)
          pdf.setFontSize(12)
          pdf.setFont('helvetica', 'normal')
        }
        
        pdf.text(line, margin, yPosition)
        yPosition += 16
      }
      
      // Add suggested images section
      if (slide.suggestedImages && slide.suggestedImages.length > 0) {
        yPosition += 20
        if (yPosition > pageHeight - margin - 100) {
          pdf.addPage()
          yPosition = 80
        }
        
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Suggested Images:', margin, yPosition)
        yPosition += 20
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        for (const image of slide.suggestedImages) {
          if (yPosition > pageHeight - margin - 40) {
            pdf.addPage()
            yPosition = 80
          }
          pdf.text(`• ${image}`, margin + 20, yPosition)
          yPosition += 14
        }
      }
      
      // Add speaker notes
      if (slide.speakerNotes) {
        yPosition += 20
        if (yPosition > pageHeight - margin - 100) {
          pdf.addPage()
          yPosition = 80
        }
        
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Speaker Notes:', margin, yPosition)
        yPosition += 20
        
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'italic')
        const notesLines = pdf.splitTextToSize(slide.speakerNotes, contentWidth)
        for (const line of notesLines) {
          if (yPosition > pageHeight - margin - 40) {
            pdf.addPage()
            yPosition = 80
          }
          pdf.text(line, margin, yPosition)
          yPosition += 12
        }
      }
    }

    // Save the PDF
    const fileName = `${deckTitle.replace(/[^a-zA-Z0-9]/g, '_')}_pitch_deck.pdf`
    pdf.save(fileName)
    
    return { success: true, fileName }
  } catch (error) {
    console.error('PDF export error:', error)
    throw new Error('Failed to export PDF')
  }
}

export async function exportToPPTX(slides: Slide[], deckTitle: string, deckDescription?: string) {
  // Temporarily disabled PPTX export due to Node.js compatibility issues
  // Will be implemented as a server-side API endpoint
  try {
    console.log('PPTX export requested for:', deckTitle)
    throw new Error('PPTX export is temporarily unavailable. Please use PDF export instead.')
  } catch (error) {
    console.error('PPTX export error:', error)
    throw new Error('PPTX export is temporarily unavailable. Please use PDF export instead.')
  }
}