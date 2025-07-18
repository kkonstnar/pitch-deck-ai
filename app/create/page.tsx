"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Wand2, Building2, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthButton } from "@/components/auth-button"
import { FileUpload } from "@/components/file-upload"
import { getIndustryList } from "@/lib/pitch-templates"

export default function CreatePitchDeck() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string>("")
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    problemStatement: "",
    solution: "",
    businessModel: "",
    targetMarket: "",
    competitiveAdvantage: "",
    teamBackground: "",
    fundingAmount: "",
    financials: "",
  })

  const industries = getIndustryList()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (file: File, content: string) => {
    if (file.type.startsWith("text/") || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      setUploadedFiles((prev) => prev + `\n\n[File: ${file.name}]\n${content}`)

      // Try to auto-populate fields based on content
      const lowerContent = content.toLowerCase()

      // Auto-populate company name if found
      const companyMatch = content.match(/company[:\s]+([^\n\r.]+)/i)
      if (companyMatch && !formData.companyName) {
        handleInputChange("companyName", companyMatch[1].trim())
      }

      // Auto-populate problem if found
      const problemMatch = content.match(/problem[:\s]+([^\n\r.]{10,200})/i)
      if (problemMatch && !formData.problemStatement) {
        handleInputChange("problemStatement", problemMatch[1].trim())
      }

      // Auto-populate solution if found
      const solutionMatch = content.match(/solution[:\s]+([^\n\r.]{10,200})/i)
      if (solutionMatch && !formData.solution) {
        handleInputChange("solution", solutionMatch[1].trim())
      }
    }
  }

  const generatePitchDeck = async () => {
    if (!formData.companyName || !formData.industry || !formData.problemStatement || !formData.solution) {
      alert("Please fill in the required fields (Company Name, Industry, Problem Statement, and Solution)")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          additionalContext: uploadedFiles, // Include uploaded file content
        }),
      })

      const pitchDeck = await response.json()

      if (pitchDeck.error) {
        throw new Error(pitchDeck.error)
      }

      // Save the generated deck
      const deckId = Date.now().toString()
      const newDeck = {
        id: deckId,
        title: pitchDeck.title,
        description: pitchDeck.description,
        industry: pitchDeck.industry,
        createdAt: new Date().toLocaleDateString(),
        slides: pitchDeck.slides,
      }

      const savedDecks = JSON.parse(localStorage.getItem("generatedDecks") || "[]")
      savedDecks.push(newDeck)
      localStorage.setItem("generatedDecks", JSON.stringify(savedDecks))

      // Save slides with enhanced data
      const slidesWithMetadata = pitchDeck.slides.map((slide: any, index: number) => ({
        id: `slide_${index}`,
        type:
          index === 0
            ? "title"
            : index === 1
              ? "problem"
              : index === 2
                ? "solution"
                : index === 3
                  ? "market"
                  : index === 4
                    ? "product"
                    : index === 5
                      ? "business"
                      : index === 6
                        ? "traction"
                        : index === 7
                          ? "competition"
                          : index === 8
                            ? "team"
                            : index === 9
                              ? "financials"
                              : index === 10
                                ? "funding"
                                : "content",
        title: slide.title,
        content: slide.content,
        suggestedImages: slide.suggestedImages || [],
        speakerNotes: slide.speakerNotes || "",
      }))

      localStorage.setItem(`slides_${deckId}`, JSON.stringify(slidesWithMetadata))

      router.push(`/editor/${deckId}`)
    } catch (error) {
      console.error("Error generating pitch deck:", error)
      alert("Failed to generate pitch deck. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-white grid-background-subtle font-['Inter','Gellix',sans-serif]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-medium text-black">Create Pitch Deck</h1>
              <p className="text-gray-600">Generate a customized pitch deck outline</p>
            </div>
          </div>
          <AuthButton />
        </div>

        <Card className="border border-gray-200 mb-6 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Documents (Optional)
            </CardTitle>
            <p className="text-sm text-gray-600">
              Upload business plans, pitch decks, or other documents to auto-populate fields
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <FileUpload onFileUpload={handleFileUpload} />
              <span className="text-sm text-gray-500">Supported: .txt, .md, .pdf, .doc, images</span>
            </div>
            {uploadedFiles && (
              <div className="mt-4 p-3 bg-blue-50/80 backdrop-blur-sm rounded-lg">
                <p className="text-sm text-blue-700">
                  ✓ Files uploaded and analyzed. Some fields may have been auto-populated.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="e.g., TechFlow Solutions"
                  className="bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Industry <span className="text-red-500">*</span>
                </label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                  <SelectTrigger className="bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.key} value={industry.key}>
                        {industry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Problem Statement <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.problemStatement}
                onChange={(e) => handleInputChange("problemStatement", e.target.value)}
                placeholder="What specific problem does your company solve? Be specific about the pain point and its impact."
                className="h-20 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Solution <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.solution}
                onChange={(e) => handleInputChange("solution", e.target.value)}
                placeholder="How does your product/service solve this problem? What makes your approach unique?"
                className="h-20 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Business Model</label>
                <Textarea
                  value={formData.businessModel}
                  onChange={(e) => handleInputChange("businessModel", e.target.value)}
                  placeholder="How do you make money? (e.g., SaaS subscription, marketplace fees, etc.)"
                  className="h-16 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Target Market</label>
                <Textarea
                  value={formData.targetMarket}
                  onChange={(e) => handleInputChange("targetMarket", e.target.value)}
                  placeholder="Who are your ideal customers? Market size and characteristics."
                  className="h-16 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Competitive Advantage</label>
              <Textarea
                value={formData.competitiveAdvantage}
                onChange={(e) => handleInputChange("competitiveAdvantage", e.target.value)}
                placeholder="What sets you apart from competitors? Your unique moat or differentiator."
                className="h-16 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Team Background</label>
                <Textarea
                  value={formData.teamBackground}
                  onChange={(e) => handleInputChange("teamBackground", e.target.value)}
                  placeholder="Key team members and their relevant experience."
                  className="h-16 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Funding Amount</label>
                <Input
                  value={formData.fundingAmount}
                  onChange={(e) => handleInputChange("fundingAmount", e.target.value)}
                  placeholder="e.g., $2M Series A"
                  className="bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Financial Information</label>
              <Textarea
                value={formData.financials}
                onChange={(e) => handleInputChange("financials", e.target.value)}
                placeholder="Current revenue, growth metrics, projections, or any relevant financial data."
                className="h-20 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={generatePitchDeck}
                disabled={isGenerating}
                className="bg-black hover:bg-gray-800 text-white px-8"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating Pitch Deck..." : "Generate Pitch Deck"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
