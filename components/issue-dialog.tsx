"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function IssueDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [issue, setIssue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || !issue.trim()) return

    setIsSubmitting(true)

    // Here you would typically send the data to your backend
    // For now, we'll just simulate a submission with a timeout
    try {
      console.log("Issue submitted:", { name, issue })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)
      setName("")
      setIssue("")

      // Close the dialog after showing success message for 2 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setOpen(false)
      }, 2000)
    } catch (error) {
      console.error("Error submitting issue:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Submit Issue</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {isSubmitted ? (
          <div className="py-6 text-center">
            <h3 className="text-lg font-medium mb-2">Thank you!</h3>
            <p className="text-muted-foreground">
              Thank you for sharing this with us. It'll help us improve your experience on the app.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Submit an Issue</DialogTitle>
              <DialogDescription>
                Let us know about any issues you've encountered while using the app.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="issue" className="text-right">
                  Issue
                </Label>
                <Textarea
                  id="issue"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Please be as descriptive as possible"
                  className="col-span-3 h-32"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
