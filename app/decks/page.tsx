"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Presentation, Trash2, MessageSquare } from "lucide-react"
import Link from "next/link"
import { AuthButton } from "@/components/auth-button"

interface GeneratedDeck {
  id: string
  title: string
  description: string
  industry?: string
  createdAt: string
  slides: any[]
}

const industryColors: Record<string, string> = {
  saas: "bg-blue-100 text-blue-800",
  fintech: "bg-green-100 text-green-800",
  healthcare: "bg-red-100 text-red-800",
  ecommerce: "bg-purple-100 text-purple-800",
  ai: "bg-orange-100 text-orange-800",
  general: "bg-gray-100 text-gray-800",
}

export default function GeneratedDecks() {
  const [decks, setDecks] = useState<GeneratedDeck[]>([])

  useEffect(() => {
    const savedDecks = localStorage.getItem("generatedDecks")
    if (savedDecks) {
      setDecks(JSON.parse(savedDecks))
    }
  }, [])

  const deleteDeck = (id: string) => {
    const updatedDecks = decks.filter((deck) => deck.id !== id)
    setDecks(updatedDecks)
    localStorage.setItem("generatedDecks", JSON.stringify(updatedDecks))
    localStorage.removeItem(`slides_${id}`)
  }

  return (
    <div className="min-h-screen bg-white grid-background-subtle font-['Inter','Gellix',sans-serif]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-medium text-black">Generated Pitch Decks</h1>
              <p className="text-gray-600">Your industry-specific AI-created presentations</p>
            </div>
          </div>
          <AuthButton />
        </div>

        {decks.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No pitch decks yet</h3>
            <p className="text-gray-500 mb-6">
              Start a conversation to create your first industry-specific presentation
            </p>
            <Link href="/">
              <Button className="bg-black hover:bg-gray-800 text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Creating
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
              <Card
                key={deck.id}
                className="border border-gray-200 hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="truncate text-lg font-medium">{deck.title}</CardTitle>
                        {deck.industry && (
                          <Badge className={`text-xs ${industryColors[deck.industry] || industryColors.general}`}>
                            {deck.industry.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{deck.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteDeck(deck.id)}
                      className="text-gray-400 hover:text-red-600 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{deck.slides.length} slides</span>
                    <span>{deck.createdAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/editor/${deck.id}`} className="flex-1">
                      <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 bg-transparent">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/present/${deck.id}`} className="flex-1">
                      <Button className="w-full bg-black hover:bg-gray-800 text-white">
                        <Presentation className="w-4 h-4 mr-2" />
                        Present
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
