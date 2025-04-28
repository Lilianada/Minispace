import { IssueDialog } from "./issue-dialog"
import { ThemeToggle } from "./theme-toggle"

export function Footer() {
  return (
    <footer className="border-t py-4 mt-8">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span className="hidden md:block font-bold">MINI</span>
        </div>
          <span className="md:hidden block font-bold">MINI</span>
        <div className="hidden md:block">
          <IssueDialog />
        </div>
      </div>
    </footer>
  )
}
