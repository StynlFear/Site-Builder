import { CodeEditor } from "@/components/code-editor"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/topbar"

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <CodeEditor />
        </main>
      </div>
    </div>
  )
}
