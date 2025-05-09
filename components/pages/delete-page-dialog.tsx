"use client"

import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Page } from "./page-list"

interface DeletePageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  page: Page | null
  onDelete: () => void
}

export function DeletePageDialog({
  open,
  onOpenChange,
  page,
  onDelete
}: DeletePageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Page</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this page? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="font-medium">{page?.title}</p>
          <p className="text-sm text-muted-foreground">/{page?.slug}</p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete Page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
