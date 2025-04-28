"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { toast } from "@/components/ui/use-toast"
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
    try {
      await addDoc(collection(db, "issues"), {
        name: name.trim(),
        issue: issue.trim(),
        createdAt: new Date(),
      })
      setIsSubmitted(true)
      setName("")
      setIssue("")
      toast({ title: "Issue submitted!", description: "Thank you for your feedback." })
      setTimeout(() => {
        setIsSubmitted(false)
        setOpen(false)
      }, 2000)
    } catch (error) {
      toast({ title: "Submission failed", description: "Could not submit your issue. Please try again.", variant: "destructive" })
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
      <DialogContent className="shadow-lg">
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
            <div className="grid grid-cols-1 gap-4 py-4 justify-start items-center">
              <Label htmlFor="name" className="md:col-span-1">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="md:col-span-3"
                placeholder="Your name"
                disabled={isSubmitting}
              />
              <Label htmlFor="issue" className="md:col-span-1">Issue</Label>
              <Textarea
                id="issue"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Please be as descriptive as possible"
                className="md:col-span-3 h-32"
                disabled={isSubmitting}
              />
            </div>
            <DialogFooter className="justify-end">
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
