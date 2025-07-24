"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/topbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatMessage } from "@/components/chat-message"
import { CodeEditor } from "@/components/code-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Play, Code, MessageSquare, Loader2, AlertCircle } from "lucide-react"
import { chatAPI, previewAPI, authUtils } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  _id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: string
  messageType: 'text' | 'code_generation'
  generatedCode?: {
    html: string
    css: string
    js: string
    prompt: string
    generatedAt: string
  }
}

interface Conversation {
  _id: string
  title: string
  messages: Message[]
  lastMessageAt: string
}

interface CodeData {
  html: string
  css: string
  js: string
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string
  
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [currentCode, setCurrentCode] = useState<CodeData>({ html: '', css: '', js: '' })
  const [previewDocument, setPreviewDocument] = useState("")
  const [activeTab, setActiveTab] = useState("chat")
  const [previewLoading, setPreviewLoading] = useState(false)

  // Fetch conversation data
  const fetchConversation = async () => {
    if (!authUtils.isLoggedIn()) {
      setError('Please log in to view conversations')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await chatAPI.getChatById(conversationId)
      console.log('Conversation response:', response)
      console.log('Response structure:', {
        hasConversation: !!response.conversation,
        hasData: !!response.data,
        rawResponse: response
      })
      
      // Handle different response structures
      let conversationData = response
      if (response.conversation) {
        conversationData = response.conversation
      } else if (response.data) {
        conversationData = response.data
      }
      
      console.log('Final conversation data:', conversationData)
      console.log('Messages in conversation:', conversationData.messages?.length || 0)
      
      setConversation(conversationData)
      
      // Fetch current code state
      await fetchCurrentCode()
      
    } catch (err) {
      console.error('Error fetching conversation:', err)
      setError('Failed to load conversation')
    } finally {
      setLoading(false)
    }
  }

  // Fetch current code state
  const fetchCurrentCode = async () => {
    try {
      console.log('Fetching current code for conversation:', conversationId)
      const response = await previewAPI.getCurrentCode(conversationId)
      console.log('Current code response:', response)
      
      if (response.success && response.data.currentCode) {
        console.log('Setting current code:', response.data.currentCode)
        setCurrentCode(response.data.currentCode)
      } else {
        console.log('No current code found or unsuccessful response')
      }
    } catch (err) {
      console.error('Error fetching current code:', err)
    }
  }

  // Fetch live preview
  const fetchPreview = async () => {
    try {
      setPreviewLoading(true)
      console.log('Fetching preview for conversation:', conversationId)
      const response = await previewAPI.getPreview(conversationId)
      console.log('Preview response:', response)
      
      if (response.success && response.data.previewDocument) {
        console.log('Setting preview document, length:', response.data.previewDocument.length)
        setPreviewDocument(response.data.previewDocument)
      } else {
        console.log('No preview document in response or unsuccessful')
      }
    } catch (err) {
      console.error('Error fetching preview:', err)
    } finally {
      setPreviewLoading(false)
    }
  }

  // Send regular chat message
  const sendChatMessage = async () => {
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      
      // Send to chat endpoint (regular chat without code generation)
      const response = await chatAPI.sendChatMessage(conversationId, newMessage.trim())
      
      if (response.success) {
        setNewMessage("")
        await fetchConversation() // Refresh conversation
      }
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
    }
  }

  // Send message with code generation
  const sendCodeGenerationMessage = async () => {
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      console.log('Sending code generation request:', newMessage.trim())
      
      // Send to generate endpoint (chat with code generation)
      const response = await chatAPI.generateCode(conversationId, newMessage.trim())
      console.log('Code generation response:', response)
      
      if (response.success) {
        setNewMessage("")
        console.log('Code generation successful, refreshing data...')
        await fetchConversation() // Refresh conversation
        await fetchCurrentCode() // Refresh current code
        await fetchPreview() // Refresh preview
      } else {
        console.error('Code generation failed:', response.message)
      }
    } catch (err) {
      console.error('Error generating code:', err)
    } finally {
      setSending(false)
    }
  }

  // Update code sections
  const updateCode = async (codeData: CodeData) => {
    try {
      const response = await chatAPI.updateCodeSection(conversationId, codeData)
      
      if (response.success) {
        setCurrentCode(codeData)
        await fetchPreview() // Refresh preview
      }
    } catch (err) {
      console.error('Error updating code:', err)
    }
  }

  // Format timestamp
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  useEffect(() => {
    if (conversationId) {
      fetchConversation()
    }
  }, [conversationId])

  useEffect(() => {
    if (activeTab === "preview") {
      fetchPreview()
    }
  }, [activeTab])

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading conversation...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={() => {
                  setError(null)
                  fetchConversation()
                }}
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div>Conversation not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
       <main className="flex-1 flex flex-col h-full min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1">
            <div className="border-b px-4 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-semibold">{conversation.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    {conversation.messages.length} messages
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Code Editor
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Live Preview
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="chat" className="flex-1 flex flex-col m-0">
              <div className="flex-1 overflow-auto p-4">
                <div className="max-w-3xl mx-auto">
                  {conversation.messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet</p>
                      <p className="text-sm">Start the conversation by sending a message below</p>
                    </div>
                  ) : (
                    conversation.messages.map((message) => {
                      console.log('Rendering message:', message)
                      return (
                        <ChatMessage
                          key={message._id}
                          message={message.text}
                          isUser={message.sender === 'user'}
                          timestamp={formatTimestamp(message.timestamp)}
                          hasCode={message.messageType === 'code_generation'}
                        />
                      )
                    })
                  )}
                </div>
              </div>

              <div className="border-t p-4">
                <div className="max-w-3xl mx-auto flex gap-2">
                  <Input 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..." 
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendChatMessage()
                      }
                    }}
                    disabled={sending}
                  />
                  <Button onClick={sendChatMessage} disabled={sending || !newMessage.trim()}>
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={sendCodeGenerationMessage} 
                    disabled={sending || !newMessage.trim()}
                    variant="outline"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Code className="h-4 w-4 mr-2" />
                        Generate Code
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="code" className="flex-1 m-0">
              <div className="p-4 border-b bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Code Editor</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentCode.html || currentCode.css || currentCode.js 
                        ? 'Edit your generated code below' 
                        : 'No code generated yet - generate some code in the chat first'}
                    </p>
                  </div>
                  {(currentCode.html || currentCode.css || currentCode.js) && (
                    <div className="text-xs text-muted-foreground">
                      {currentCode.html && 'HTML '}
                      {currentCode.css && 'CSS '}
                      {currentCode.js && 'JS '}
                      available
                    </div>
                  )}
                </div>
              </div>
              <CodeEditor 
                initialCode={currentCode}
                onCodeChange={updateCode}
                conversationId={conversationId}
              />
            </TabsContent>

          <TabsContent value="preview" className="flex-1 m-0" style={{ minHeight: "300px", height: "auto" }}>
              <div className="h-full p-2">
                <div className="h-full border rounded-lg overflow-hidden flex flex-col" style={{ height: '100%'  }}>
                  {previewLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading preview...</span>
                      </div>
                    </div>
                  ) : previewDocument ? (
                    <iframe
                      srcDoc={`
                        <style>
                          html, body { 
                            margin: 0; 
                            padding: 0; 
                            height: 100%; 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            overflow-x: hidden;
                          }
                          body { 
                            display: flex; 
                            flex-direction: column; 
                            align-items: center; 
                            padding: 10px 20px;
                            box-sizing: border-box;
                            min-height: 100vh;
                          }
                          body > * {
                            margin-top: 0 !important;
                          }
                          body > *:first-child {
                            margin-top: 0 !important;
                            padding-top: 0 !important;
                          }
                        </style>
                        ${previewDocument}
                      `}
                      className="w-full h-full border-0"
                      title="Live Preview"
                      style={{ 
                        backgroundColor: 'white',
                        minHeight: '100%'
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No preview available</p>
                        <p className="text-sm">Generate some code first to see the preview</p>
                        <div className="mt-4 text-xs">
                          <p>Current code state:</p>
                          <p>HTML: {currentCode.html ? 'Available' : 'Empty'}</p>
                          <p>CSS: {currentCode.css ? 'Available' : 'Empty'}</p>
                          <p>JS: {currentCode.js ? 'Available' : 'Empty'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
