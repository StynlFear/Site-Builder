"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

interface CodeData {
  html: string
  css: string
  js: string
}

interface CodeEditorProps {
  initialCode?: CodeData
  onCodeChange?: (codeData: CodeData) => void
  conversationId?: string
}

export function CodeEditor({ 
  initialCode = { html: '', css: '', js: '' }, 
  onCodeChange,
  conversationId 
}: CodeEditorProps) {
  const [html, setHtml] = useState(
    initialCode.html || '<div class="container">\n  <h1>Hello World</h1>\n  <p>Welcome to my website!</p>\n</div>',
  )
  const [css, setCss] = useState(
    initialCode.css || "body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n}",
  )
  const [js, setJs] = useState(
    initialCode.js || 'document.addEventListener("DOMContentLoaded", () => {\n  console.log("Page loaded!");\n});',
  )

  // Update local state when initialCode changes
  useEffect(() => {
    if (initialCode.html) setHtml(initialCode.html)
    if (initialCode.css) setCss(initialCode.css)
    if (initialCode.js) setJs(initialCode.js)
  }, [initialCode])

  const handleSave = () => {
    const codeData = { html, css, js }
    if (onCodeChange) {
      onCodeChange(codeData)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="html" className="flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <TabsList>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="js">JavaScript</TabsTrigger>
          </TabsList>
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save and Update
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
