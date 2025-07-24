"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { MessageSquare, Plus, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { chatAPI, authUtils } from "@/lib/api"

interface Conversation {
  id: string
  title: string
  lastMessage?: string | {
    text?: string
    messageType?: string
    sender?: string
    timestamp?: string
    generatedCode?: string
    _id?: string
  }
  updatedAt: string
  createdAt: string
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newChatTitle, setNewChatTitle] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  // Function to refresh conversations
  const refreshConversations = async () => {
    if (!authUtils.isLoggedIn()) {
      console.log('User not authenticated, skipping conversation fetch')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log('Fetching conversations...') // Debug log
      const data = await chatAPI.getChats()
      console.log('API Response:', data) // Debug log
      
      // Handle different possible response structures
      let conversationsData = []
      if (Array.isArray(data)) {
        conversationsData = data
      } else if (data.chats && Array.isArray(data.chats)) {
        conversationsData = data.chats
      } else if (data.conversations && Array.isArray(data.conversations)) {
        conversationsData = data.conversations
      } else if (data.data && Array.isArray(data.data)) {
        conversationsData = data.data
      }
      
      // Log the structure of the first conversation if any exist
      if (conversationsData.length > 0) {
        console.log('First conversation structure:', conversationsData[0])
        console.log('First conversation lastMessage:', conversationsData[0].lastMessage)
      }
      
      console.log('Processed conversations:', conversationsData) // Debug log
      setConversations(conversationsData)
    } catch (err) {
      setError('Failed to load conversations')
      console.error('Error fetching conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to extract last message text
  const getLastMessageText = (lastMessage?: string | object): string => {
    if (!lastMessage) return ''
    if (typeof lastMessage === 'string') return lastMessage
    if (typeof lastMessage === 'object' && lastMessage !== null) {
      const messageObj = lastMessage as any
      return messageObj.text || messageObj.message || 'New message'
    }
    return ''
  }

  // Function to format timestamp
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMins < 1) return 'Just now'
    if (diffInMins < 60) return `${diffInMins} min ago`
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  // Fetch conversations on component mount
  useEffect(() => {
    refreshConversations()
  }, [])

  // Handle creating a new chat
  const handleNewChat = () => {
    setIsCreateModalOpen(true)
    setNewChatTitle("")
  }

  // Handle creating chat with title from modal
  const handleCreateChat = async () => {
    if (!newChatTitle.trim()) return

    try {
      setIsCreating(true)
      const response = await chatAPI.createChat(newChatTitle.trim())
      console.log('Create chat response:', response) // Debug log
      
      // Handle different possible response structures for the new chat
      let newChat = response
      if (response.chat) {
        newChat = response.chat
      } else if (response.conversation) {
        newChat = response.conversation
      } else if (response.data) {
        newChat = response.data
      }
      
      console.log('New chat object:', newChat) // Debug log
      
      // Refresh the conversations list to get the latest data
      await refreshConversations()
      
      setIsCreateModalOpen(false)
      setNewChatTitle("")
      // Navigate to the new chat
      router.push(`/chat/${newChat.id}`)
    } catch (err) {
      console.error('Error creating new chat:', err)
    } finally {
      setIsCreating(false)
    }
  }

  // Handle modal form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleCreateChat()
  }

  return (
    <div className="flex h-full w-80 flex-col border-r bg-background">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <MessageSquare className="h-6 w-6" />
          <span>Conversations</span>
        </Link>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" onClick={handleNewChat}>
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Conversation</DialogTitle>
              <DialogDescription>
                Give your new conversation a descriptive title to help you find it later.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Input
                    id="title"
                    placeholder="Enter conversation title..."
                    value={newChatTitle}
                    onChange={(e) => setNewChatTitle(e.target.value)}
                    className="col-span-3"
                    autoFocus
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={!newChatTitle.trim() || isCreating}
                >
                  {isCreating ? "Creating..." : "Create Conversation"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <div className="text-sm text-muted-foreground">Loading conversations...</div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-4 gap-2">
              <div className="text-sm text-red-500">{error}</div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={refreshConversations}
                className="text-xs"
              >
                Retry
              </Button>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 gap-2">
              <div className="text-sm text-muted-foreground">No conversations yet</div>
              <div className="text-xs text-muted-foreground">Create your first conversation to get started</div>
            </div>
          ) : (
            conversations.map((conversation) => {
              const isActive = pathname === `/chat/${conversation.id}`
              return (
                <Link
                  key={conversation.id}
                  href={`/chat/${conversation.id}`}
                  className={cn(
                    "flex flex-col gap-1 rounded-lg p-3 mb-2 cursor-pointer hover:bg-accent transition-colors block",
                    isActive ? "bg-accent" : "",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate">
                      {getLastMessageText(conversation.lastMessage)}
                    </p>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(conversation.updatedAt)}
                  </span>
                </Link>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
