"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export function CodeEditor() {
  const [html, setHtml] = useState(
    '<div class="container">\n  <h1>Hello World</h1>\n  <p>Welcome to my website!</p>\n</div>',
  )
  const [css, setCss] = useState(
    "body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n}",
  )
  const [js, setJs] = useState(
    'document.addEventListener("DOMContentLoaded", () => {\n  console.log("Page loaded!");\n});',
  )

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="html" className="flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <TabsList>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="js">JavaScript</TabsTrigger>
          </TabsList>
          <Button size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save and Generate
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <TabsContent value="html" className="h-full mt-0">
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-slate-950 text-slate-50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              spellCheck="false"
            />
          </TabsContent>

          <TabsContent value="css" className="h-full mt-0">
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-slate-950 text-slate-50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              spellCheck="false"
            />
          </TabsContent>

          <TabsContent value="js" className="h-full mt-0">
            <textarea
              value={js}
              onChange={(e) => setJs(e.target.value)}
              className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-slate-950 text-slate-50 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              spellCheck="false"
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
