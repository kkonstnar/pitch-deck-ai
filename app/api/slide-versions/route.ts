export async function POST(req: Request) {
  try {
    const { action, slideId, deckId, slideData, versionId } = await req.json()
    
    switch (action) {
      case "save": {
        // Save a new version of the slide
        const timestamp = new Date().toISOString()
        const versionKey = `slide_versions_${slideId}`
        
        // Get existing versions
        const existingVersions = JSON.parse(localStorage.getItem(versionKey) || "[]")
        
        // Create new version
        const newVersion = {
          id: `v_${Date.now()}`,
          timestamp,
          slideData,
          changes: generateChangeSummary(existingVersions[0]?.slideData, slideData)
        }
        
        // Keep only last 10 versions
        const updatedVersions = [newVersion, ...existingVersions.slice(0, 9)]
        
        // Save to localStorage (in a real app, this would be a database)
        if (typeof window !== "undefined") {
          localStorage.setItem(versionKey, JSON.stringify(updatedVersions))
        }
        
        return Response.json({ success: true, versionId: newVersion.id })
      }
      
      case "list": {
        // Get all versions for a slide
        const versionKey = `slide_versions_${slideId}`
        const versions = JSON.parse(localStorage.getItem(versionKey) || "[]")
        
        return Response.json({ versions })
      }
      
      case "restore": {
        // Restore a specific version
        const versionKey = `slide_versions_${slideId}`
        const versions = JSON.parse(localStorage.getItem(versionKey) || "[]")
        const version = versions.find((v: any) => v.id === versionId)
        
        if (!version) {
          return Response.json({ error: "Version not found" }, { status: 404 })
        }
        
        return Response.json({ slideData: version.slideData })
      }
      
      default:
        return Response.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Version control error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateChangeSummary(oldData: any, newData: any) {
  const changes: string[] = []
  
  if (!oldData) return ["Initial version"]
  
  if (oldData.title !== newData.title) {
    changes.push(`Title changed from "${oldData.title}" to "${newData.title}"`)
  }
  
  if (oldData.content !== newData.content) {
    const contentDiff = Math.abs(newData.content.length - oldData.content.length)
    if (contentDiff > 50) {
      changes.push(`Content significantly modified (${contentDiff} characters)`)
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