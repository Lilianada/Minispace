import { IssueDialog } from "./issue-dialog"

export function Footer() {
  return (
    <footer className="border-t py-4 mt-8">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="font-bold">MINI</div>
        <div className="hidden md:block">
          <IssueDialog />
        </div>
      </div>
    </footer>
  )
}
