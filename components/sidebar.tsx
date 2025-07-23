"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquare, Plus, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const conversations = [
  {
    id: 1,
    title: "Coffee Shop Landing Page",
    lastMessage: "That sounds great! I'll help you create...",
    timestamp: "2 min ago",
    isActive: true,
  },
  {
    id: 2,
    title: "Portfolio Website",
    lastMessage: "Let's add a contact form to your portfolio...",
    timestamp: "1 hour ago",
    isActive: false,
  },
  {
    id: 3,
    title: "E-commerce Store",
    lastMessage: "We can implement a shopping cart with...",
    timestamp: "3 hours ago",
    isActive: false,
  },
  {
    id: 4,
    title: "Blog Template",
    lastMessage: "Here's the HTML structure for your blog...",
    timestamp: "1 day ago",
    isActive: false,
  },
  {
    id: 5,
    title: "Restaurant Menu",
    lastMessage: "I'll help you create an interactive menu...",
    timestamp: "2 days ago",
    isActive: false,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-80 flex-col border-r bg-background">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <MessageSquare className="h-6 w-6" />
          <span>Conversations</span>
        </Link>
        <Button size="sm" variant="ghost">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "flex flex-col gap-1 rounded-lg p-3 mb-2 cursor-pointer hover:bg-accent transition-colors",
                conversation.isActive ? "bg-accent" : "",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
              <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
