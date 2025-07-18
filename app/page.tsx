"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChat } from "ai/react"
import { Send, Presentation, Building2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AuthButton } from "@/components/auth-button"
import { FileUpload } from "@/components/file-upload"
import Link from "next/link"
import type React from "react"

const examples = [
  "Create a SaaS pitch deck for my project management tool",
  "I need a fintech presentation for my payment platform",
  "Generate a healthcare pitch for my medical device",
  "Build an AI/ML deck for my computer vision startup",
  "Make an e-commerce pitch for my D2C brand",
  "Create a biotech presentation for my drug discovery platform",
]

export default function HomePage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })
  const router = useRouter()
  const [uploadedContent, setUploadedContent] = useState<string>("")

  const hasMessages = messages.length > 0

  const handleExampleClick = (example: string) => {
    handleInputChange({ target: { value: example } } as any)
  }

  const handleFileUpload = (file: File, content: string) => {
    let processedContent = ""

    if (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      processedContent = `\n\n[Uploaded file: ${file.name}]\n${content}`
    } else if (file.type.startsWith("image/")) {
      processedContent = `\n\n[Uploaded image: ${file.name}] - Image uploaded for reference`
    } else {
      processedContent = `\n\n[Uploaded file: ${file.name}] - File attached for reference`
    }

    setUploadedContent((prev) => prev + processedContent)

    // Auto-append to current input if there's content
    if (content && (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md"))) {
      const contextualPrompt = `I've uploaded a document (${file.name}). Please analyze this content and help me create a pitch deck based on the information provided: ${content.substring(0, 500)}${content.length > 500 ? "..." : ""}`
      handleInputChange({ target: { value: input + (input ? "\n\n" : "") + contextualPrompt } } as any)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullInput = input + uploadedContent

    // Create a synthetic event with the combined content
    const syntheticEvent = {
      preventDefault: () => {},
      target: { value: fullInput },
    } as any

    handleSubmit(syntheticEvent)
    setUploadedContent("") // Clear uploaded content after submission
  }

  // --- Detect & parse GENERATE_DECK payload ---------------------------
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== "assistant" || !lastMessage.content.includes("GENERATE_DECK:")) return

    // 1️⃣  Grab everything that follows the token
    let raw = lastMessage.content.split("GENERATE_DECK:")[1] ?? ""

    // 2️⃣  Strip common wrappers (\`\`\`json … \`\`\` or plain \`\`\` … \`\`\`)
    raw = raw
      .replace(/^\s*```(?:json)?/i, "") // leading fence
      .replace(/```$/, "") // trailing fence
      .trim()

    // 3️⃣  Keep only the JSON block (from first "{" to last "}")
    const firstBrace = raw.indexOf("{")
    const lastBrace = raw.lastIndexOf("}")
    if (firstBrace === -1 || lastBrace === -1) return

    const jsonString = raw.slice(firstBrace, lastBrace + 1)
    
    // 4️⃣  Check if JSON appears complete (enhanced validation)
    if (!jsonString.includes('"slides"') || !jsonString.includes('"title"')) return
    
    // Check for balanced braces and brackets
    const braceCount = (jsonString.match(/\{/g) || []).length - (jsonString.match(/\}/g) || []).length
    const bracketCount = (jsonString.match(/\[/g) || []).length - (jsonString.match(/\]/g) || []).length
    if (braceCount !== 0 || bracketCount !== 0) return
    
    // Check if it ends properly (should end with }])
    if (!jsonString.trim().endsWith('}')) return

    try {
      const parsedDeck = JSON.parse(jsonString)
      
      // Validate required fields
      if (!parsedDeck.title || !parsedDeck.slides || !Array.isArray(parsedDeck.slides)) {
        console.log("Invalid deck structure:", parsedDeck)
        return
      }
      
      // Check if slides array is properly formatted
      if (parsedDeck.slides.length === 0) {
        console.log("Empty slides array")
        return
      }

      /* ---------- persist deck & redirect ---------- */
      const deckId = Date.now().toString()

      const newDeck = {
        id: deckId,
        title: parsedDeck.title,
        description: parsedDeck.description,
        industry: parsedDeck.industry ?? "general",
        createdAt: new Date().toLocaleDateString(),
        slides: parsedDeck.slides,
      }

      const savedDecks = JSON.parse(localStorage.getItem("generatedDecks") || "[]")
      savedDecks.push(newDeck)
      localStorage.setItem("generatedDecks", JSON.stringify(savedDecks))

      localStorage.setItem(
        `slides_${deckId}`,
        JSON.stringify(
          parsedDeck.slides.map((s: any, i: number) => ({
            id: `slide_${i}`,
            type: "content",
            title: s.title,
            content: s.content,
          })),
        ),
      )

      router.push(`/editor/${deckId}`)
    } catch (err) {
      console.error("Failed to parse GENERATE_DECK payload:", err, { raw })
    }
  }, [messages, router])

  return (
    <div className="min-h-screen bg-white grid-background-subtle font-['Inter','Gellix',sans-serif]">
      <div className="max-w-3xl mx-auto">
        {!hasMessages ? (
          /* Initial State */
          <div className="flex flex-col min-h-screen px-4">
            {/* Header with Auth */}
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-2">
                
                <span className="font-medium text-black">PitchDeck AI</span>
              </div>
              <AuthButton />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-medium text-black mb-3">What do you want to pitch?</h1>
                  <p className="text-gray-600 text-lg">
                    Create industry-specific investor presentations by chatting with AI.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="mb-8">
                  <div className="relative">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Describe your startup and industry, and I'll create a tailored pitch deck..."
                      className="w-full h-14 pl-4 pr-20 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white/80 backdrop-blur-sm"
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <FileUpload onFileUpload={handleFileUpload} disabled={isLoading} />
                    </div>
                  </div>
                  {uploadedContent && (
                    <div className="mt-2 text-sm text-blue-600 bg-blue-50/80 backdrop-blur-sm p-2 rounded">
                      Files uploaded and ready to be analyzed
                    </div>
                  )}
                </form>

                <div className="text-center mb-6">
                  <span className="text-sm text-gray-500">or try an industry-specific example</span>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {examples.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleExampleClick(example)}
                      className="text-sm border-gray-300 hover:bg-gray-50 hover:border-gray-400 bg-white/80 backdrop-blur-sm"
                    >
                      {example}
                    </Button>
                  ))}
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-4">
                    <span>or use our structured form</span>
                  </div>
                  <Link href="/create">
                    <Button variant="outline" className="border-gray-300 hover:bg-gray-50 bg-white/80 backdrop-blur-sm">
                      <Building2 className="w-4 h-4 mr-2" />
                      Create with Form
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat State */
          <div className="flex flex-col min-h-screen">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white/90 backdrop-blur-sm p-4 sticky top-0 z-10">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                <h1 className="font-medium text-black">Industry-Specific Pitch Deck Assistant</h1>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => router.push("/decks")}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <Presentation className="w-4 h-4 mr-2" />
                    My Decks
                  </Button>
                  <AuthButton />
                </div>
              </div>
            </div>

            <div className="flex-1 px-4 py-8">
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-2xl rounded-lg px-4 py-3 ${
                        message.role === "user"
                          ? "bg-black text-white"
                          : "bg-white/90 backdrop-blur-sm text-black border border-gray-200"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content.includes("GENERATE_DECK:")
                          ? message.content.split("GENERATE_DECK:")[0] +
                            "\n\n✨ Generating your industry-specific pitch deck..."
                          : message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-3 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Input */}
            <div className="border-t border-gray-200 bg-white/90 backdrop-blur-sm p-4 sticky bottom-0">
              <form onSubmit={handleFormSubmit}>
                <div className="relative max-w-2xl mx-auto">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Continue the conversation..."
                    className="w-full h-12 pl-4 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white/80 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    <FileUpload onFileUpload={handleFileUpload} disabled={isLoading} />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || (!input.trim() && !uploadedContent)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-black hover:bg-gray-800 disabled:bg-gray-300"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {uploadedContent && (
                  <div className="mt-2 text-sm text-blue-600 bg-blue-50/80 backdrop-blur-sm p-2 rounded max-w-2xl mx-auto">
                    Files uploaded and ready to be analyzed
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
