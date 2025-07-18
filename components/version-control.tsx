"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { History, Clock, RotateCcw, Save, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface SlideVersion {
  id: string
  timestamp: string
  slideData: any
  changes: string[]
}

interface Slide {
  id: string
  type: string
  title: string
  content: string
  suggestedImages?: string[]
  speakerNotes?: string
}

interface VersionControlProps {
  slide: Slide
  onSlideRestore: (slideData: any) => void
  onVersionSave: () => void
}

export function VersionControl({ slide, onSlideRestore, onVersionSave }: VersionControlProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [versions, setVersions] = useState<SlideVersion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadVersions()
    }
  }, [isOpen, slide.id])

  const loadVersions = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      const versionKey = `slide_versions_${slide.id}`
      const storedVersions = localStorage.getItem(versionKey)
      setVersions(storedVersions ? JSON.parse(storedVersions) : [])
    } catch (error) {
      console.error("Error loading versions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveVersion = async () => {
    try {
      const timestamp = new Date().toISOString()
      const versionKey = `slide_versions_${slide.id}`
      
      // Get existing versions
      const existingVersions = JSON.parse(localStorage.getItem(versionKey) || "[]")
      
      // Create new version
      const newVersion: SlideVersion = {
        id: `v_${Date.now()}`,
        timestamp,
        slideData: slide,
        changes: generateChangeSummary(existingVersions[0]?.slideData, slide)
      }
      
      // Keep only last 10 versions
      const updatedVersions = [newVersion, ...existingVersions.slice(0, 9)]
      
      // Save to localStorage
      localStorage.setItem(versionKey, JSON.stringify(updatedVersions))
      
      // Update local state
      setVersions(updatedVersions)
      onVersionSave()
      
      // Show success message
      console.log("Version saved successfully")
    } catch (error) {
      console.error("Error saving version:", error)
    }
  }

  const restoreVersion = async (versionId: string) => {
    try {
      const version = versions.find(v => v.id === versionId)
      if (!version) return
      
      onSlideRestore(version.slideData)
      setIsOpen(false)
    } catch (error) {
      console.error("Error restoring version:", error)
    }
  }

  const generateChangeSummary = (oldData: any, newData: any): string[] => {
    const changes: string[] = []
    
    if (!oldData) return ["Initial version"]
    
    if (oldData.title !== newData.title) {
      changes.push(`Title changed`)
    }
    
    if (oldData.content !== newData.content) {
      const contentDiff = Math.abs(newData.content.length - oldData.content.length)
      if (contentDiff > 50) {
        changes.push(`Content significantly modified`)
      } else {
        changes.push("Content updated")
      }
    }
    
    if (JSON.stringify(oldData.suggestedImages) !== JSON.stringify(newData.suggestedImages)) {
      changes.push("Image suggestions updated")
    }
    
    if (oldData.speakerNotes !== newData.speakerNotes) {
      changes.push("Speaker notes modified")
    }
    
    return changes.length > 0 ? changes : ["Minor changes"]
  }

  const getVersionPreview = (version: SlideVersion) => {
    const data = version.slideData
    return {
      title: data.title || "Untitled",
      contentPreview: data.content ? data.content.substring(0, 100) + "..." : "No content",
      hasImages: data.suggestedImages && data.suggestedImages.length > 0,
      hasNotes: data.speakerNotes && data.speakerNotes.length > 0
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={saveVersion} variant="outline" size="sm">
        <Save className="w-4 h-4 mr-2" />
        Save Version
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <History className="w-4 h-4 mr-2" />
            History ({versions.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Version History - {slide.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : versions.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No versions saved yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Click "Save Version" to create your first checkpoint
                </p>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {versions.map((version, index) => {
                    const preview = getVersionPreview(version)
                    const isSelected = selectedVersion === version.id
                    
                    return (
                      <Card 
                        key={version.id} 
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedVersion(isSelected ? null : version.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={index === 0 ? "default" : "secondary"}>
                                {index === 0 ? "Latest" : `v${versions.length - index}`}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(version.timestamp), { addSuffix: true })}
                              </div>
                            </div>
                            {index !== 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  restoreVersion(version.id)
                                }}
                              >
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Restore
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm">{preview.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{preview.contentPreview}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {preview.hasImages && (
                              <Badge variant="outline" className="text-xs">
                                Images
                              </Badge>
                            )}
                            {preview.hasNotes && (
                              <Badge variant="outline" className="text-xs">
                                Notes
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">Changes:</div>
                            <div className="flex flex-wrap gap-1">
                              {version.changes.map((change, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {change}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="pt-2 border-t">
                              <div className="text-xs text-gray-500 mb-2">Full Content Preview:</div>
                              <div className="bg-gray-50 p-2 rounded text-xs">
                                <div className="font-medium mb-1">{version.slideData.title}</div>
                                <div className="text-gray-600">
                                  {version.slideData.content.substring(0, 200)}
                                  {version.slideData.content.length > 200 && "..."}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
            
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p>• Click on any version to see a preview</p>
              <p>• Use "Restore" to revert to a previous version</p>
              <p>• Versions are automatically saved when you make significant changes</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}