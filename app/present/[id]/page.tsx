"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Play } from "lucide-react"
import Link from "next/link"

interface Slide {
  id: string
  type: string
  title: string
  content: string
}

export default function PresentationMode() {
  const params = useParams()
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [deckTitle, setDeckTitle] = useState("")

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
  }, [params.id])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        nextSlide()
      } else if (e.key === "ArrowLeft") {
        prevSlide()
      } else if (e.key === "Escape") {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentSlideIndex, slides.length])

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const currentSlide = slides[currentSlideIndex]

  if (slides.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-gray-700 mb-2">No slides found</h2>
          <p className="text-gray-500 mb-4">Create some slides first</p>
          <Link href={`/editor/${params.id}`}>
            <Button className="bg-black hover:bg-gray-800 text-white">Go to Editor</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`font-['Inter','Gellix',sans-serif] ${isFullscreen ? "fixed inset-0 z-50" : "min-h-screen"} bg-black flex flex-col`}
    >
      {/* Header */}
      {!isFullscreen && (
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/editor/${params.id}`}>
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-medium">{deckTitle || "Pitch Deck"}</h1>
              <p className="text-sm text-gray-500">
                Slide {currentSlideIndex + 1} of {slides.length}
              </p>
            </div>
          </div>
          <Button onClick={toggleFullscreen} className="bg-black hover:bg-gray-800 text-white">
            <Play className="w-4 h-4 mr-2" />
            Present
          </Button>
        </div>
      )}

      {/* Main Slide Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-5xl h-full max-h-[700px] bg-white">
          <CardHeader className="text-center border-b border-gray-200">
            <CardTitle className="text-4xl font-medium text-black">{currentSlide?.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full p-12">
            <div className="text-center max-w-4xl">
              <p className="text-xl leading-relaxed text-gray-700 whitespace-pre-wrap">{currentSlide?.content}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between">
        <Button onClick={prevSlide} disabled={currentSlideIndex === 0} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlideIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlideIndex ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <Button onClick={nextSlide} disabled={currentSlideIndex === slides.length - 1} variant="outline">
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Fullscreen Controls */}
      {isFullscreen && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black bg-opacity-50 rounded-lg p-2">
          <Button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-white text-sm">
            {currentSlideIndex + 1} / {slides.length}
          </span>
          <Button
            onClick={nextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
