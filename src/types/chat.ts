export interface Conversation {
  id: string
  name: string
  preview: string
  unread: number
  date: string
  online?: boolean
  status?: "online" | "away" | "offline"
}

export interface ChatMessage {
  id: string
  text: string
  senderId: string
  timestamp: string
  isOutgoing: boolean
}
