import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/topbar"
import { ChatMessage } from "@/components/chat-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

const messages = [
  {
    id: 1,
    message: "Hello! How can I help you with your website today?",
    isUser: false,
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    message: "I want to create a landing page for my business. Can you help me with that?",
    isUser: true,
    timestamp: "10:31 AM",
  },
  {
    id: 3,
    message:
      "I can help you create a landing page. What kind of business do you have and what sections would you like to include on your landing page?",
    isUser: false,
    timestamp: "10:32 AM",
  },
  {
    id: 4,
    message: "I have a coffee shop. I'd like to include sections for our menu, location, about us, and a contact form.",
    isUser: true,
    timestamp: "10:34 AM",
  },
  {
    id: 5,
    message:
      "That sounds great! I'll help you create a landing page for your coffee shop with those sections. Let's start with the HTML structure for your page.",
    isUser: false,
    timestamp: "10:35 AM",
  },
]

export default function ChatPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto p-4">
            <div className="max-w-3xl mx-auto">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.message}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
            </div>
          </div>

          <div className="border-t p-4">
            <div className="max-w-3xl mx-auto flex gap-2">
              <Input placeholder="Type your message..." className="flex-1" />
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
