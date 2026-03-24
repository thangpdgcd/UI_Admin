import { useState, useCallback, useEffect } from "react"
import type { ChatMessage } from "@/types/chat"

const mockMessagesByConversation: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "1",
      text: "Hey! How's the project going?",
      senderId: "other",
      timestamp: "9:30 AM",
      isOutgoing: false,
    },
    {
      id: "2",
      text: "Going well! We're on track for the demo next week.",
      senderId: "me",
      timestamp: "9:32 AM",
      isOutgoing: true,
    },
    {
      id: "3",
      text: "That's great to hear. Do you need any help with the presentation?",
      senderId: "other",
      timestamp: "9:33 AM",
      isOutgoing: false,
    },
    {
      id: "4",
      text: "Actually yes, could you review the slides when I'm done?",
      senderId: "me",
      timestamp: "9:35 AM",
      isOutgoing: true,
    },
    {
      id: "5",
      text: "Sure, just send them over when ready!",
      senderId: "other",
      timestamp: "9:36 AM",
      isOutgoing: false,
    },
  ],
  "2": [
    {
      id: "6",
      text: "Thanks for the update on the project",
      senderId: "other",
      timestamp: "10:15 AM",
      isOutgoing: false,
    },
  ],
  "3": [],
  "4": [],
  "5": [],
}

export function useChat(conversationId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading] = useState(false)

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      return
    }
    setMessages(mockMessagesByConversation[conversationId] ?? [])
  }, [conversationId])

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !conversationId) return
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        text: text.trim(),
        senderId: "me",
        timestamp: new Date().toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
        }),
        isOutgoing: true,
      }
      setMessages((prev) => [...prev, newMsg])
    },
    [conversationId]
  )

  return {
    messages,
    sendMessage,
    loading,
  }
}
