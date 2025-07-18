"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Paperclip, ImageIcon, X, FileText } from "lucide-react"

interface FileUploadProps {
  onFileUpload: (file: File, content: string) => void
  disabled?: boolean
}

export function FileUpload({ onFileUpload, disabled }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; type: string; content: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    try {
      let content = ""

      if (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        // Handle text files
        content = await file.text()
      } else if (file.type.startsWith("image/")) {
        // Handle images - convert to base64 for display
        content = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.readAsDataURL(file)
        })
      } else {
        // For other file types, just store the name and basic info
        content = `File uploaded: ${file.name} (${file.type || "unknown type"})`
      }

      const fileData = {
        name: file.name,
        type: file.type,
        content: content,
      }

      setUploadedFiles((prev) => [...prev, fileData])
      onFileUpload(file, content)
    } catch (error) {
      console.error("Error processing file:", error)
      alert("Error processing file. Please try again.")
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
    // Reset input
    if (event.target) {
      event.target.value = ""
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex items-center gap-2">
      {/* Document Upload */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-gray-100"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        <Paperclip className="h-4 w-4 text-gray-500" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.pdf,.doc,.docx,text/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Upload */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-gray-100"
        onClick={() => imageInputRef.current?.click()}
        disabled={disabled}
      >
        <ImageIcon className="h-4 w-4 text-gray-500" />
      </Button>
      <input ref={imageInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-1 ml-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
              {file.type.startsWith("image/") ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
              <span className="max-w-20 truncate">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-blue-100"
                onClick={() => removeFile(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
