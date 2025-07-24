"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/topbar"
import { MessageSquare } from "lucide-react"

export default function ChatPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard if no specific chat is selected
    router.push('/dashboard')
  }, [router])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No Conversation Selected</h2>
            <p className="text-muted-foreground">
              Select a conversation from the sidebar or create a new one to get started.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
