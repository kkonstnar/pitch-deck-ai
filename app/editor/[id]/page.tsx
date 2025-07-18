"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Plus,
  GripVertical,
  Trash2,
  ImageIcon,
  Wand2,
  ArrowUp,
  ArrowDown,
  Copy,
  Download,
  FileText,
  MessageCircle,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { AIChat } from "@/components/ai-chat"
import { MediaIntegration } from "@/components/media-integration"
import { VersionControl } from "@/components/version-control"

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

const slideTypes = [
  { value: "title", label: "Title Slide" },
  { value: "problem", label: "Problem Statement" },
  { value: "solution", label: "Solution" },
  { value: "market", label: "Market Opportunity" },
  { value: "product", label: "Product Demo" },
  { value: "business", label: "Business Model" },
  { value: "traction", label: "Traction & Metrics" },
  { value: "competition", label: "Competition" },
  { value: "team", label: "Team" },
  { value: "financials", label: "Financial Projections" },
  { value: "funding", label: "Funding Ask" },
  { value: "content", label: "Custom Content" },
]

export default function PitchDeckEditor() {
  const params = useParams()
  const [slides, setSlides] = useState<Slide[]>([])
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null)
  const [deckTitle, setDeckTitle] = useState("")
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)

  useEffect(() => {
    const savedSlides = localStorage.getItem(`slides_${params.id}`)
    if (savedSlides) {
      const parsedSlides = JSON.parse(savedSlides)
      setSlides(parsedSlides)
      if (parsedSlides.length > 0) {
        setSelectedSlide(parsedSlides[0])
      }
    }

    const savedDecks = localStorage.getItem("generatedDecks")
    if (savedDecks) {
      const decks = JSON.parse(savedDecks)
      const currentDeck = decks.find((deck: any) => deck.id === params.id)
      if (currentDeck) {
        setDeckTitle(currentDeck.title)
      }
    }
  }, [params.id])

  const saveSlides = (updatedSlides: Slide[]) => {
    setSlides(updatedSlides)
    localStorage.setItem(`slides_${params.id}`, JSON.stringify(updatedSlides))
  }

  const addSlide = (type = "content") => {
    const slideTemplates: Record<string, { title: string; content: string }> = {
      title: { title: "Company Name", content: "Tagline or brief description of what you do" },
      problem: { title: "The Problem", content: "What problem are you solving? Quantify the pain point." },
      solution: { title: "Our Solution", content: "How do you solve this problem? What's your unique approach?" },
      market: { title: "Market Opportunity", content: "How big is the market? What's your addressable market size?" },
      product: { title: "Product Demo", content: "Show your product in action. Key features and benefits." },
      business: { title: "Business Model", content: "How do you make money? What's your revenue model?" },
      traction: { title: "Traction", content: "What progress have you made? Key metrics and milestones." },
      competition: { title: "Competition", content: "Who are your competitors? What's your competitive advantage?" },
      team: { title: "Team", content: "Who's building this? Relevant experience and expertise." },
      financials: {
        title: "Financial Projections",
        content: "Revenue projections, key assumptions, path to profitability.",
      },
      funding: { title: "Funding Ask", content: "How much are you raising? What will you use it for?" },
      content: { title: "New Slide", content: "Add your content here..." },
    }

    const template = slideTemplates[type] || slideTemplates.content
    const newSlide: Slide = {
      id: Date.now().toString(),
      type,
      title: template.title,
      content: template.content,
    }
    const updatedSlides = [...slides, newSlide]
    saveSlides(updatedSlides)
    setSelectedSlide(newSlide)
  }

  const deleteSlide = (slideId: string) => {
    const updatedSlides = slides.filter((slide) => slide.id !== slideId)
    saveSlides(updatedSlides)
    if (selectedSlide?.id === slideId) {
      setSelectedSlide(updatedSlides[0] || null)
    }
  }

  const duplicateSlide = (slideId: string) => {
    const slideToClone = slides.find((slide) => slide.id === slideId)
    if (slideToClone) {
      const newSlide: Slide = {
        ...slideToClone,
        id: Date.now().toString(),
        title: slideToClone.title + " (Copy)",
      }
      const slideIndex = slides.findIndex((slide) => slide.id === slideId)
      const updatedSlides = [...slides]
      updatedSlides.splice(slideIndex + 1, 0, newSlide)
      saveSlides(updatedSlides)
    }
  }

  const updateSlide = (updatedSlide: Slide) => {
    const updatedSlides = slides.map((slide) => (slide.id === updatedSlide.id ? updatedSlide : slide))
    saveSlides(updatedSlides)
    setSelectedSlide(updatedSlide)
  }

  const moveSlide = (slideId: string, direction: "up" | "down") => {
    const currentIndex = slides.findIndex((slide) => slide.id === slideId)
    if (currentIndex === -1) return

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= slides.length) return

    const updatedSlides = [...slides]
    const [movedSlide] = updatedSlides.splice(currentIndex, 1)
    updatedSlides.splice(newIndex, 0, movedSlide)
    saveSlides(updatedSlides)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(slides)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    saveSlides(items)
  }

  const generateSlideContent = async () => {
    if (!selectedSlide) return

    setIsGeneratingContent(true)
    try {
      const response = await fetch("/api/generate-slide-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slideType: selectedSlide.type,
          currentTitle: selectedSlide.title,
          currentContent: selectedSlide.content,
          deckContext: slides.map((s) => ({ title: s.title, type: s.type })),
        }),
      })

      const data = await response.json()
      if (data.title && data.content) {
        updateSlide({
          ...selectedSlide,
          title: data.title,
          content: data.content,
          suggestedImages: data.suggestedImages || selectedSlide.suggestedImages,
          speakerNotes: data.speakerNotes || selectedSlide.speakerNotes,
        })
      }
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsGeneratingContent(false)
    }
  }

  const regenerateSlide = async () => {
    if (!selectedSlide) return

    setIsRegenerating(true)
    try {
      const response = await fetch("/api/generate-slide-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slideType: selectedSlide.type,
          currentTitle: "Regenerate this slide completely",
          currentContent: "Create fresh content for this slide type",
          deckContext: slides.map((s) => ({ title: s.title, type: s.type })),
          regenerate: true,
        }),
      })

      const data = await response.json()
      if (data.title && data.content) {
        updateSlide({
          ...selectedSlide,
          title: data.title,
          content: data.content,
          suggestedImages: data.suggestedImages || [],
          speakerNotes: data.speakerNotes || "",
        })
      }
    } catch (error) {
      console.error("Error regenerating content:", error)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleImageAdd = (imageUrl: string, description: string) => {
    if (!selectedSlide) return
    
    const mediaUrls = selectedSlide.mediaUrls || []
    const mediaDescriptions = selectedSlide.mediaDescriptions || []
    
    updateSlide({
      ...selectedSlide,
      mediaUrls: [...mediaUrls, imageUrl],
      mediaDescriptions: [...mediaDescriptions, description],
    })
  }

  const handleSlideRestore = (slideData: any) => {
    updateSlide(slideData)
  }

  const handleVersionSave = () => {
    console.log("Version saved successfully")
  }

  const exportPresentation = async (format: "pptx" | "pdf") => {
    if (slides.length === 0) {
      alert("No slides to export")
      return
    }

    setIsExporting(true)
    try {
      // Dynamic import to avoid SSR issues
      const { exportToPDF, exportToPPTX } = await import('@/utils/export-utils')
      
      const savedDecks = localStorage.getItem("generatedDecks")
      let deckDescription = ""
      if (savedDecks) {
        const decks = JSON.parse(savedDecks)
        const currentDeck = decks.find((deck: any) => deck.id === params.id)
        deckDescription = currentDeck?.description || ""
      }

      if (format === "pdf") {
        await exportToPDF(slides, deckTitle, deckDescription)
        console.log("PDF exported successfully")
      } else if (format === "pptx") {
        await exportToPPTX(slides, deckTitle, deckDescription)
        console.log("PPTX exported successfully")
      }
    } catch (error) {
      console.error("Export error:", error)
      alert("Failed to export presentation. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white grid-background-subtle flex font-['Inter','Gellix',sans-serif]">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white/90 backdrop-blur-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/decks">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="font-medium truncate">{deckTitle || "Pitch Deck"}</h1>
          </div>

          <Select onValueChange={(value) => addSlide(value)}>
            <SelectTrigger className="w-full mb-2">
              <SelectValue placeholder="Add slide type..." />
            </SelectTrigger>
            <SelectContent>
              {slideTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={() => addSlide()} variant="outline" className="w-full mb-4" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Slide
          </Button>

          {/* Export Buttons */}
          <div className="space-y-2">
            <Button
              onClick={() => exportPresentation("pptx")}
              disabled={isExporting || slides.length === 0}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Exporting..." : "Export PPTX"}
            </Button>
            <Button
              onClick={() => exportPresentation("pdf")}
              disabled={isExporting || slides.length === 0}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="slides">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {slides.map((slide, index) => (
                    <Draggable key={slide.id} draggableId={slide.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedSlide?.id === slide.id
                              ? "border-black bg-gray-50"
                              : "border-gray-200 hover:border-gray-300"
                          } ${snapshot.isDragging ? "shadow-lg" : ""}`}
                          onClick={() => setSelectedSlide(slide)}
                        >
                          <div className="flex items-center gap-2">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-gray-500">#{index + 1}</span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                  {slideTypes.find((t) => t.value === slide.type)?.label || "Custom"}
                                </span>
                              </div>
                              <p className="text-sm font-medium truncate">{slide.title}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveSlide(slide.id, "up")
                                }}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                                disabled={index === 0}
                              >
                                <ArrowUp className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  moveSlide(slide.id, "down")
                                }}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                                disabled={index === slides.length - 1}
                              >
                                <ArrowDown className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  duplicateSlide(slide.id)
                                }}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteSlide(slide.id)
                                }}
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {selectedSlide ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    Slide {slides.findIndex((s) => s.id === selectedSlide.id) + 1} of {slides.length}
                  </span>
                  <Select
                    value={selectedSlide.type}
                    onValueChange={(value) => updateSlide({ ...selectedSlide, type: value })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {slideTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link href={`/present/${params.id}`}>
                    <Button className="bg-black hover:bg-gray-800 text-white" size="sm">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Present
                    </Button>
                  </Link>
                  <Link href={`/script/${params.id}`}>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Script
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Slide Tools Section */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Button onClick={generateSlideContent} disabled={isGeneratingContent || isRegenerating} variant="outline" size="sm">
                    <Wand2 className="w-4 h-4 mr-2" />
                    {isGeneratingContent ? "Generating..." : "AI Enhance"}
                  </Button>
                  <Button onClick={regenerateSlide} disabled={isGeneratingContent || isRegenerating} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {isRegenerating ? "Regenerating..." : "Regenerate"}
                  </Button>
                  <Button onClick={() => setIsAIChatOpen(true)} variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    AI Chat
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <MediaIntegration
                    slideType={selectedSlide.type}
                    slideTitle={selectedSlide.title}
                    slideContent={selectedSlide.content}
                    onImageAdd={handleImageAdd}
                  />
                  <VersionControl
                    slide={selectedSlide}
                    onSlideRestore={handleSlideRestore}
                    onVersionSave={handleVersionSave}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Main Content Card */}
                <Card className="border border-gray-200 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <Input
                      value={selectedSlide.title}
                      onChange={(e) => updateSlide({ ...selectedSlide, title: e.target.value })}
                      className="text-3xl font-bold border-none p-0 focus-visible:ring-0 bg-transparent text-gray-800 placeholder-gray-400"
                      placeholder="Slide title..."
                    />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Textarea
                      value={selectedSlide.content}
                      onChange={(e) => updateSlide({ ...selectedSlide, content: e.target.value })}
                      className="w-full h-96 resize-none border-none p-0 focus-visible:ring-0 bg-transparent text-lg leading-relaxed text-gray-700 placeholder-gray-400"
                      placeholder="Add your slide content here..."
                    />
                  </CardContent>
                </Card>

                {/* Added Media Section */}
                {selectedSlide.mediaUrls && selectedSlide.mediaUrls.length > 0 && (
                  <Card className="border border-gray-200 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        Added Media ({selectedSlide.mediaUrls.length})
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSlide.mediaUrls.map((url, index) => (
                          <div key={index} className="space-y-2">
                            <div className="bg-gray-50 rounded-lg p-2 border">
                              <img
                                src={url}
                                alt={selectedSlide.mediaDescriptions?.[index] || "Added media"}
                                className="w-full h-32 object-cover rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none"
                                }}
                              />
                            </div>
                            <p className="text-sm text-gray-600">
                              {selectedSlide.mediaDescriptions?.[index] || "No description"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Suggested Images Section */}
                {selectedSlide.suggestedImages && selectedSlide.suggestedImages.length > 0 && (
                  <Card className="border border-gray-200 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        Suggested Images
                      </h4>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {selectedSlide.suggestedImages.map((image, index) => (
                          <li key={index} className="flex items-start gap-3 text-base text-gray-700">
                            <div className="w-2 h-2 bg-gray-500 rounded-full flex-shrink-0 mt-2"></div>
                            <span className="leading-relaxed">{image}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Speaker Notes Section */}
                <Card className="border border-gray-200 bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Speaker Notes
                    </h4>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={selectedSlide.speakerNotes || ""}
                      onChange={(e) => updateSlide({ ...selectedSlide, speakerNotes: e.target.value })}
                      className="w-full h-32 resize-none border-none p-0 focus-visible:ring-0 bg-transparent text-base text-gray-700 placeholder-gray-400 leading-relaxed"
                      placeholder="Add speaker notes and talking points..."
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No slide selected</h3>
              <p className="text-gray-500">Select a slide from the sidebar to start editing</p>
            </div>
          </div>
        )}
      </div>
      
      {/* AI Chat Modal */}
      <AIChat
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        selectedSlide={selectedSlide}
        onUpdateSlide={updateSlide}
        deckContext={slides.map((s) => ({ title: s.title, type: s.type }))}
      />
    </div>
  )
}
