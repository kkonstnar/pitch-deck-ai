"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Wand2, Copy, Download, Play, Clock } from "lucide-react"
import Link from "next/link"

interface Slide {
  id: string
  type: string
  title: string
  content: string
}

const scriptStyles = [
  { value: "conversational", label: "Conversational" },
  { value: "formal", label: "Formal Presentation" },
  { value: "storytelling", label: "Storytelling" },
  { value: "data-driven", label: "Data-Driven" },
  { value: "demo-focused", label: "Demo-Focused" },
]

const presentationLengths = [
  { value: "5", label: "5 minutes (Elevator Pitch)" },
  { value: "10", label: "10 minutes (Standard)" },
  { value: "15", label: "15 minutes (Detailed)" },
  { value: "20", label: "20 minutes (Comprehensive)" },
]

export default function ScriptGenerator() {
  const params = useParams()
  const [slides, setSlides] = useState<Slide[]>([])
  const [script, setScript] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [deckTitle, setDeckTitle] = useState("")
  const [scriptStyle, setScriptStyle] = useState("conversational")
  const [presentationLength, setPresentationLength] = useState("10")
  const [selectedSlideScript, setSelectedSlideScript] = useState<Record<string, string>>({})

  useEffect(() => {
    const savedSlides = localStorage.getItem(`slides_${params.id}`)
    if (savedSlides) {
      setSlides(JSON.parse(savedSlides))
    }

    const savedDecks = localStorage.getItem("generatedDecks")
    if (savedDecks) {
      const decks = JSON.parse(savedDecks)
      const currentDeck = decks.find((deck: any) => deck.id === params.id)
      if (currentDeck) {
        setDeckTitle(currentDeck.title)
      }
    }

    const savedScript = localStorage.getItem(`script_${params.id}`)
    if (savedScript) {
      setScript(savedScript)
    }

    const savedSlideScripts = localStorage.getItem(`slide_scripts_${params.id}`)
    if (savedSlideScripts) {
      setSelectedSlideScript(JSON.parse(savedSlideScripts))
    }
  }, [params.id])

  const generateFullScript = async () => {
    if (slides.length === 0) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slides: slides.map((slide) => ({
            title: slide.title,
            content: slide.content,
            type: slide.type,
          })),
          style: scriptStyle,
          length: Number.parseInt(presentationLength),
          deckTitle,
        }),
      })

      const data = await response.json()
      if (data.script) {
        setScript(data.script)
        localStorage.setItem(`script_${params.id}`, data.script)
      }
      if (data.slideScripts) {
        setSelectedSlideScript(data.slideScripts)
        localStorage.setItem(`slide_scripts_${params.id}`, JSON.stringify(data.slideScripts))
      }
    } catch (error) {
      console.error("Error generating script:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateSlideScript = async (slideId: string) => {
    const slide = slides.find((s) => s.id === slideId)
    if (!slide) return

    try {
      const response = await fetch("/api/generate-slide-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slide: {
            title: slide.title,
            content: slide.content,
            type: slide.type,
          },
          style: scriptStyle,
          context: slides.map((s) => ({ title: s.title, type: s.type })),
        }),
      })

      const data = await response.json()
      if (data.script) {
        const updatedScripts = { ...selectedSlideScript, [slideId]: data.script }
        setSelectedSlideScript(updatedScripts)
        localStorage.setItem(`slide_scripts_${params.id}`, JSON.stringify(updatedScripts))
      }
    } catch (error) {
      console.error("Error generating slide script:", error)
    }
  }

  const copyScript = () => {
    navigator.clipboard.writeText(script)
  }

  const downloadScript = () => {
    const blob = new Blob([script], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${deckTitle}-script.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const saveScript = () => {
    localStorage.setItem(`script_${params.id}`, script)
  }

  const estimatedTime = Math.ceil((script.split(" ").length / 150) * 60) // ~150 words per minute

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-['Inter','Gellix',sans-serif]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/editor/${params.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Script Generator</h1>
            <p className="text-gray-600">{deckTitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Script Configuration */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Script Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Presentation Style</label>
                  <Select value={scriptStyle} onValueChange={setScriptStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {scriptStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Target Length</label>
                  <Select value={presentationLength} onValueChange={setPresentationLength}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {presentationLengths.map((length) => (
                        <SelectItem key={length.value} value={length.value}>
                          {length.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={generateFullScript} disabled={isGenerating || slides.length === 0} className="w-full">
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate Full Script"}
                </Button>

                {script && (
                  <div className="flex gap-2">
                    <Button onClick={copyScript} variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={downloadScript} variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}

                {script && (
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Estimated time: {Math.floor(estimatedTime / 60)}:{(estimatedTime % 60).toString().padStart(2, "0")}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Slide-by-Slide Scripts */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Slide Scripts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {slides.map((slide, index) => (
                    <div key={slide.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          #{index + 1} {slide.title}
                        </span>
                        <Button
                          onClick={() => generateSlideScript(slide.id)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Wand2 className="w-3 h-3 mr-1" />
                          Generate
                        </Button>
                      </div>
                      {selectedSlideScript[slide.id] && (
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {selectedSlideScript[slide.id].substring(0, 100)}...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Script Editor */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Presentation Script</CardTitle>
                  <div className="flex gap-2">
                    <Link href={`/present/${params.id}`}>
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Practice
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {script ? (
                  <Textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    onBlur={saveScript}
                    className="min-h-[600px] font-mono text-sm"
                    placeholder="Your presentation script will appear here..."
                  />
                ) : (
                  <div className="text-center py-12">
                    <Wand2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No script generated yet</h3>
                    <p className="text-gray-500 mb-4">
                      Configure your presentation style and generate an AI-powered script
                    </p>
                    <Button onClick={generateFullScript} disabled={isGenerating || slides.length === 0}>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Script
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
