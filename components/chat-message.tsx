import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessageProps {
  message: string
  isUser: boolean
  timestamp: string
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={cn("flex gap-3 mb-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("rounded-lg p-4 max-w-[80%]", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
        <p className="text-sm">{message}</p>
        <span className="text-xs opacity-70 block mt-1">{timestamp}</span>
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
