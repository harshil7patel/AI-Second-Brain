"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Sidebar from "@/components/layout/Sidebar"
import NoteEditor from "@/components/notes/NoteEditor"
import { useNotes } from "@/hooks/useNotes"
import { Note } from "@/types"
import { Loader2, Brain } from "lucide-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"

export default function NotePage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { notes, loading, createNote, updateNote, deleteNote, togglePin } = useNotes()
  const [note, setNote] = useState<Note | null>(null)
  const [search, setSearch] = useState("")
  const [authed, setAuthed] = useState(false)

  const id = params.id as string

  // Auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/login")
      else setAuthed(true)
    })
  }, [supabase, router])

  useEffect(() => {
    if (!loading && notes.length > 0 && authed) {
      const found = notes.find(n => n.id === id)
      if (found) setNote(found)
      else {
        toast.error("Note not found")
        router.push("/dashboard")
      }
    }
  }, [id, notes, loading, router, authed])

  async function handleUpdate(noteId: string, updates: Partial<Note>) {
    await updateNote(noteId, updates)
    setNote(prev => prev ? { ...prev, ...updates } : prev)
  }

  async function handleNewNote() {
    const n = await createNote("Untitled Note", "")
    if (n) router.push(`/notes/${n.id}`)
  }

  async function handleDelete(noteId: string) {
    await deleteNote(noteId)
    if (noteId === id) router.push("/dashboard")
  }

  if (!authed || loading || !note) return (
    <div className="flex h-screen bg-surface-950 items-center justify-center relative overflow-hidden">
      <div className="orb orb-cyan absolute top-[-200px] right-[-100px] animate-orb-float" />
      <div className="orb orb-purple absolute bottom-[-150px] left-[-100px] animate-orb-float-2" />
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-12 h-12 rounded-xl bg-brand-400/10 border border-brand-400/20 flex items-center justify-center glow-brand"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Brain className="w-6 h-6 text-brand-400" />
        </motion.div>
        <p className="text-text-2 text-sm animate-pulse font-medium">Loading note…</p>
      </motion.div>
    </div>
  )

  return (
    <div className="flex h-screen bg-surface-950 overflow-hidden">
      <Sidebar
        notes={notes} activeNoteId={id} onNewNote={handleNewNote}
        onDeleteNote={handleDelete} onTogglePin={togglePin}
        searchQuery={search} onSearch={setSearch}
      />
      <main className="flex-1 overflow-hidden bg-surface-950">
        <NoteEditor note={note} onUpdate={handleUpdate} onTogglePin={togglePin} />
      </main>
    </div>
  )
}
