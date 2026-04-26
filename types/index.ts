export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  tags: string[]
  is_pinned: boolean
  word_count: number
  created_at: string
  updated_at: string
}

export interface AIChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface SummaryResult {
  type: "2-mark" | "5-mark" | "10-mark"
  content: string
  note_id: string
}

export interface SearchResult {
  note: Note
  score: number
  preview: string
}
