"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ImageIcon, Download, ExternalLink, Copy, CheckCircle } from "lucide-react"

interface ImageSuggestion {
  description: string
  searchTerms: string[]
  type: "chart" | "diagram" | "photo" | "icon" | "infographic" | "screenshot"
  stockPhotoUrl?: string
  iconSuggestion?: string
}

interface MediaIntegrationProps {
  slideType: string
  slideTitle: string
  slideContent: string
  onImageAdd: (imageUrl: string, description: string) => void
}

export function MediaIntegration({ slideType, slideTitle, slideContent, onImageAdd }: MediaIntegrationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [imageSuggestions, setImageSuggestions] = useState<ImageSuggestion[]>([])
  const [copiedText, setCopiedText] = useState("")

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery
    if (!searchTerm.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch("/api/search-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchTerm,
          slideType,
          slideTitle,
          slideContent
        })
      })

      if (!response.ok) throw new Error("Failed to search images")

      const data = await response.json()
      setImageSuggestions(data.images || [])
    } catch (error) {
      console.error("Error searching images:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleCopySearchTerms = (terms: string[]) => {
    const searchText = terms.join(", ")
    navigator.clipboard.writeText(searchText)
    setCopiedText(searchText)
    setTimeout(() => setCopiedText(""), 2000)
  }

  const handleCopyIcon = (iconSuggestion: string) => {
    navigator.clipboard.writeText(iconSuggestion)
    setCopiedText(iconSuggestion)
    setTimeout(() => setCopiedText(""), 2000)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "chart": return "bg-blue-100 text-blue-800"
      case "diagram": return "bg-purple-100 text-purple-800"
      case "photo": return "bg-green-100 text-green-800"
      case "icon": return "bg-orange-100 text-orange-800"
      case "infographic": return "bg-red-100 text-red-800"
      case "screenshot": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Add Media
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Media Integration - {slideTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Search for images, charts, icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={() => handleSearch()} disabled={isSearching}>
              <Search className="w-4 h-4 mr-2" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Quick searches:</span>
            {[
              "business growth chart",
              "team collaboration",
              "data dashboard",
              "financial graph",
              "market analysis"
            ].map((suggestion) => (
              <Badge
                key={suggestion}
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => handleSearch(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>

          {/* Results */}
          {imageSuggestions.length > 0 && (
            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {imageSuggestions.map((image, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge className={getTypeColor(image.type)}>
                          {image.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm font-medium">{image.description}</p>
                      
                      {/* Search Terms */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Search Terms:</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopySearchTerms(image.searchTerms)}
                            className="h-6 px-2"
                          >
                            {copiedText === image.searchTerms.join(", ") ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {image.searchTerms.map((term, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {term}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Stock Photo */}
                      {image.stockPhotoUrl && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Stock Photo:</span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(image.stockPhotoUrl, "_blank")}
                                className="h-6 px-2"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onImageAdd(image.stockPhotoUrl!, image.description)}
                                className="h-6 px-2"
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-gray-100 rounded p-2">
                            <img
                              src={image.stockPhotoUrl}
                              alt={image.description}
                              className="w-full h-24 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none"
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Icon Suggestion */}
                      {image.iconSuggestion && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Icon Suggestion:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyIcon(image.iconSuggestion!)}
                              className="h-6 px-2"
                            >
                              {copiedText === image.iconSuggestion ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <div className="bg-blue-50 rounded p-2">
                            <code className="text-xs text-blue-800">
                              {image.iconSuggestion}
                            </code>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Instructions */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Use search terms to find images on stock photo sites like Unsplash, Pexels, or Shutterstock</p>
            <p>• Click the external link icon to open stock photos directly</p>
            <p>• Copy icon suggestions to use in your presentation software</p>
            <p>• Use the download icon to add images to your slide</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}