"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface DataExportProps {
  onExport: () => void
  isExporting: boolean
}

export function DataExport({
  onExport,
  isExporting
}: DataExportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="mr-2 h-5 w-5" />
          Data Export
        </CardTitle>
        <CardDescription>Download a copy of your data</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Download a JSON file containing all your blog posts, pages, and account information.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={onExport} disabled={isExporting}>
          {isExporting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
              Exporting...
            </>
          ) : (
            <>Export Data</>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
