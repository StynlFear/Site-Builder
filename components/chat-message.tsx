import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Code } from "lucide-react"

interface ChatMessageProps {
  message: string
  isUser: boolean
  timestamp: string
  hasCode?: boolean
}

export function ChatMessage({ message, isUser, timestamp, hasCode = false }: ChatMessageProps) {
  return (
    <div className={cn("flex gap-3 mb-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("rounded-lg p-4 max-w-[80%]", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <p className="text-sm whitespace-pre-wrap">{message}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs opacity-70">{timestamp}</span>
              {hasCode && (
                <div className="flex items-center gap-1 text-xs opacity-70">
                  <Code className="h-3 w-3" />
                  <span>Code generated</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isUser && (
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
