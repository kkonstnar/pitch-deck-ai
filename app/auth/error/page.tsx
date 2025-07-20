"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function AuthError() {
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Authentication Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            There was an error signing you in. This could be due to:
          </p>
          {reason && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-sm text-red-700">Error reason: {reason}</p>
            </div>
          )}
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• Invalid Supabase configuration</li>
            <li>• Network connectivity issues</li>
            <li>• Authentication service temporarily unavailable</li>
            <li>• Invalid or expired authentication request</li>
          </ul>
          <div className="flex flex-col gap-2 pt-4">
            <Link href="/">
              <Button className="w-full">
                Try Again
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                Continue Without Signing In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}