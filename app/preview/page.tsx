import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import { ExternalLink, Download } from "lucide-react"

export default function PreviewPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 flex flex-col">
          <div className="border-b px-4 py-2 flex items-center justify-between bg-muted/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Preview Mode</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </Button>
              <Button size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg h-full overflow-hidden flex flex-col">
              <div className="border-b px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center text-sm text-gray-500 dark:text-gray-400">
                  localhost:3000/preview
                </div>
              </div>

              <div className="flex-1 p-4 overflow-auto">
                <div className="max-w-3xl mx-auto">
                  <h1 className="text-2xl font-bold mb-4">Hello World</h1>
                  <p className="mb-4">Welcome to my website!</p>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This is a preview of your website. The actual content will be rendered based on your HTML, CSS,
                      and JavaScript code.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
