"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Note } from "@/types"
import { countWords, formatDate } from "@/lib/utils"
import { Pin, Sparkles, ChevronDown, Save, Tag, X, Download, Check, Loader2 } from "lucide-react"
import SummaryPanel from "@/components/ai/SummaryPanel"
import ExportNote from "@/components/notes/ExportNote"
import TextareaAutosize from "react-textarea-autosize"

interface NoteEditorProps {
  note: Note
  onUpdate: (id: string, updates: Partial<Note>) => void
  onTogglePin: (note: Note) => void
}

export default function NoteEditor({ note, onUpdate, onTogglePin }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [tags, setTags] = useState<string[]>(note.tags ?? [])
  const [tagInput, setTagInput] = useState("")
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const saveTimer = useRef<NodeJS.Timeout | null>(null)

  // Reset when note changes
  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setTags(note.tags ?? [])
    setDirty(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id])

  const save = useCallback(async () => {
    if (!dirty) return
    setSaving(true)
    await onUpdate(note.id, { title, content, tags })
    setSaving(false)
    setDirty(false)
  }, [dirty, note.id, title, content, tags, onUpdate])

  // Auto-save after 1.5 s of inactivity
  useEffect(() => {
    if (!dirty) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(save, 1500)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [dirty, save])

  function onChange(field: "title" | "content", value: string) {
    if (field === "title") setTitle(value)
    else setContent(value)
    setDirty(true)
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" && tagInput.trim()) {
      const newTag = tagInput.trim().toLowerCase()
      if (!tags.includes(newTag)) {
        const next = [...tags, newTag]
        setTags(next)
        onUpdate(note.id, { tags: next })
      }
      setTagInput("")
    }
  }

  function removeTag(tag: string) {
    const next = tags.filter(t => t !== tag)
    setTags(next)
    onUpdate(note.id, { tags: next })
  }

  const words = countWords(content)
  const currentNote: Note = { ...note, title, content, tags }

  const tagColors = [
    "bg-brand-400/10 text-brand-400 border-brand-400/15",
    "bg-accent-400/10 text-accent-400 border-accent-400/15",
    "bg-blue-400/10 text-blue-400 border-blue-400/15",
    "bg-amber-400/10 text-amber-400 border-amber-400/15",
    "bg-pink-400/10 text-pink-400 border-pink-400/15",
  ]

  return (
    <motion.div
      className="flex flex-col h-full relative"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="dot-grid absolute inset-0 opacity-20" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-border glass-sidebar relative z-10">
        <div className="flex items-center gap-3 text-xs text-text-3">
          <span>{formatDate(note.updated_at)}</span>
          <span className="w-1 h-1 rounded-full bg-text-3" />
          <motion.span
            key={words}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="tabular-nums"
          >
            {words} words
          </motion.span>
          <span className="w-1 h-1 rounded-full bg-text-3" />
          <AnimatePresence mode="wait">
            {saving ? (
              <motion.span
                key="saving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-brand-400 flex items-center gap-1.5"
              >
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving…
              </motion.span>
            ) : !dirty ? (
              <motion.span
                key="saved"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-brand-400 flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Saved
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => onTogglePin(note)}
            className={`p-2 rounded-xl transition-all duration-200 ${note.is_pinned
              ? "text-brand-400 bg-brand-400/10 border border-brand-400/15"
              : "text-text-3 hover:bg-surface-700 hover:text-text-2 border border-transparent"}`}>
            <Pin className="w-4 h-4" />
          </button>
          <button onClick={save} disabled={!dirty}
            className="p-2 rounded-xl text-text-3 hover:bg-surface-700 hover:text-text-2 transition-all duration-200 disabled:opacity-30 border border-transparent">
            <Save className="w-4 h-4" />
          </button>
          <button onClick={() => setShowExport(true)}
            className="p-2 rounded-xl text-text-3 hover:bg-surface-700 hover:text-text-2 transition-all duration-200 border border-transparent"
            title="Export note">
            <Download className="w-4 h-4" />
          </button>
          <motion.button onClick={() => setShowSummary(v => !v)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-500/15 to-brand-400/10 border border-accent-400/15 text-accent-400 hover:from-accent-500/25 hover:to-brand-400/15 text-xs font-bold transition-all duration-200"
            whileTap={{ scale: 0.96 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
            Summarize
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showSummary ? "rotate-180" : ""}`} />
          </motion.button>
        </div>
      </div>

      {/* Summary panel */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden relative z-10"
          >
            <SummaryPanel noteId={note.id} onClose={() => setShowSummary(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-8 py-8 max-w-3xl mx-auto w-full relative z-10">
        <TextareaAutosize
          value={title}
          onChange={e => onChange("title", e.target.value)}
          placeholder="Note title…"
          className="w-full bg-transparent text-[40px] font-bold text-text-1 placeholder:text-text-3/40 resize-none focus:outline-none mb-6 leading-tight tracking-tight"
          minRows={1}
        />

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <Tag className="w-3.5 h-3.5 text-text-3" />
          <AnimatePresence>
            {tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg border font-medium ${tagColors[i % tagColors.length]}`}
              >
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:opacity-60 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <input
            value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
            placeholder="Add tag…"
            className="bg-transparent text-xs text-text-2 placeholder:text-text-3 focus:outline-none w-24"
          />
        </div>

        <TextareaAutosize
          value={content}
          onChange={e => onChange("content", e.target.value)}
          placeholder="Start writing your note… Use Markdown for formatting."
          className="w-full bg-transparent text-[15px] text-text-1 placeholder:text-text-3/40 resize-none focus:outline-none leading-8 font-mono"
          minRows={20}
        />
      </div>

      {/* Export modal */}
      {showExport && <ExportNote note={currentNote} onClose={() => setShowExport(false)} />}
    </motion.div>
  )
}
