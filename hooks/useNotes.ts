"use client"
import { useState, useEffect, useCallback } from "react"
import { Note } from "@/types"
import toast from "react-hot-toast"

export function useNotes(searchQuery = "") {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotes = useCallback(async () => {
    setLoading(true)
    try {
      const url = searchQuery ? `/api/notes?q=${encodeURIComponent(searchQuery)}` : "/api/notes"
      const res = await fetch(url)
      const data = await res.json()
      setNotes(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Failed to load notes")
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  async function createNote(title: string, content: string, tags: string[] = []) {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, tags }),
    })
    if (!res.ok) { toast.error("Failed to create note"); return null }
    const note = await res.json()
    setNotes(prev => [note, ...prev])
    toast.success("Note created!")
    return note as Note
  }

  async function updateNote(id: string, updates: Partial<Note>) {
    const res = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!res.ok) { toast.error("Failed to save note"); return }
    const updated = await res.json()
    setNotes(prev => prev.map(n => n.id === id ? updated : n))
  }

  async function deleteNote(id: string) {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" })
    if (!res.ok) { toast.error("Failed to delete note"); return }
    setNotes(prev => prev.filter(n => n.id !== id))
    toast.success("Note deleted")
  }

  async function togglePin(note: Note) {
    await updateNote(note.id, { is_pinned: !note.is_pinned })
  }

  return { notes, loading, createNote, updateNote, deleteNote, togglePin, refetch: fetchNotes }
}
