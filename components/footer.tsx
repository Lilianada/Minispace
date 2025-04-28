import { Minimize } from "lucide-react"
import { IssueDialog } from "./issue-dialog"

export function Footer() {
  return (
    <footer className="border-t py-3 mt-2">
      <div className="  mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
         <Minimize className="h-4 w-4" />
        </div>
          <span className="md:hidden block text-sm">Built for simplicity.</span>
        <div className="hidden md:block">
          <IssueDialog />
        </div>
      </div>
    </footer>
  )
}
