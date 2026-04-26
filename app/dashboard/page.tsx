"use client"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import Sidebar from "@/components/layout/Sidebar"
import AskAI from "@/components/ai/AskAI"
import PdfUpload from "@/components/notes/PdfUpload"
import { useNotes } from "@/hooks/useNotes"
import { Note } from "@/types"
import { FileText, Brain, TrendingUp, Sparkles, Plus, FileUp, Loader2, ArrowRight, Zap, Flame, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const duration = 800
    const start = performance.now()
    const initial = 0
    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(initial + (value - initial) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value])
  return <>{display.toLocaleString()}</>
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()
  const tab = searchParams.get("tab")
  const [search, setSearch] = useState("")
  const [showPdfUpload, setShowPdfUpload] = useState(false)
  const [authed, setAuthed] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [userName, setUserName] = useState("")
  const { notes, loading, createNote, deleteNote, togglePin } = useNotes(search)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login")
      } else {
        setAuthed(true)
        const name = session.user?.user_metadata?.full_name || session.user?.email?.split("@")[0] || ""
        setUserName(name)
      }
      setAuthChecking(false)
    })
  }, [supabase, router])

  async function handleNewNote() {
    const note = await createNote("Untitled Note", "")
    if (note) router.push(`/notes/${note.id}`)
  }

  function handlePdfUploaded(noteId: string) {
    setShowPdfUpload(false)
    router.push(`/notes/${noteId}`)
    router.refresh()
  }

  if (authChecking || !authed) {
    return (
      <div className="flex h-screen bg-surface-950 items-center justify-center">
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
      </div>
    )
  }

  const totalWords = notes.reduce((s, n) => s + (n.word_count ?? 0), 0)
  const pinned = notes.filter(n => n.is_pinned).length
  const recent = notes.slice(0, 6)
  const now = new Date()

  const stats = [
    {
      icon: FileText, label: "Total Notes", value: notes.length,
      color: "text-brand-400", bg: "bg-brand-400/8", borderColor: "border-brand-400/10",
      glow: "shadow-brand-400/5",
    },
    {
      icon: TrendingUp, label: "Total Words", value: totalWords,
      color: "text-accent-400", bg: "bg-accent-400/8", borderColor: "border-accent-400/10",
      glow: "shadow-accent-400/5",
    },
    {
      icon: Sparkles, label: "Pinned", value: pinned,
      color: "text-blue-400", bg: "bg-blue-400/8", borderColor: "border-blue-400/10",
      glow: "shadow-blue-400/5",
    },
  ]

  return (
    <div className="flex h-screen bg-surface-950 overflow-hidden">
      <Sidebar
        notes={notes} onNewNote={handleNewNote} onDeleteNote={deleteNote}
        onTogglePin={togglePin} searchQuery={search} onSearch={setSearch}
      />

      <main className="flex-1 overflow-hidden relative">
        {/* Background orbs */}
        <div className="orb orb-cyan absolute top-[-200px] right-[-200px] animate-orb-float pointer-events-none" />
        <div className="orb orb-purple absolute bottom-[-150px] left-[-150px] animate-orb-float-2 pointer-events-none" />
        <div className="dot-grid absolute inset-0 pointer-events-none opacity-40" />

        {tab === "ai" ? (
          <AskAI />
        ) : (
          <div className="h-full overflow-y-auto px-8 py-8 relative z-10">
            <motion.div
              className="max-w-5xl mx-auto"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {/* Welcome */}
              <motion.div className="mb-8" variants={fadeUp}>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-display text-text-1">
                    {getGreeting()}, <span className="gradient-text">{userName}</span> 👋
                  </h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-text-3" />
                    {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 font-medium">1</span> day streak
                  </span>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" variants={fadeUp}>
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className={`glass glass-hover rounded-2xl p-6 cursor-default border ${stat.borderColor} shadow-lg ${stat.glow}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.1 }}
                  >
                    <div className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <p className="text-3xl font-bold text-text-1 tracking-tight">
                      <AnimatedNumber value={typeof stat.value === "number" ? stat.value : 0} />
                    </p>
                    <p className="text-xs text-text-2 mt-1.5 font-semibold uppercase tracking-widest">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Quick actions */}
              <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" variants={fadeUp}>
                <motion.button
                  onClick={handleNewNote}
                  className="glass glass-hover rounded-2xl p-6 text-left group border border-transparent hover:border-brand-400/10"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-400/8 flex items-center justify-center mb-4 group-hover:bg-brand-400/15 transition-colors">
                    <Plus className="w-5 h-5 text-brand-400" />
                  </div>
                  <p className="font-bold text-text-1 text-sm mb-1">New Note</p>
                  <p className="text-xs text-text-3 leading-relaxed">Start capturing thoughts</p>
                  <ArrowRight className="w-4 h-4 text-text-3 mt-4 group-hover:text-brand-400 group-hover:translate-x-1.5 transition-all duration-300" />
                </motion.button>

                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link href="/dashboard?tab=ai"
                    className="glass glass-hover rounded-2xl p-6 text-left block h-full group border border-transparent hover:border-accent-400/10">
                    <div className="w-11 h-11 rounded-xl bg-accent-400/8 flex items-center justify-center mb-4 group-hover:bg-accent-400/15 transition-colors">
                      <Brain className="w-5 h-5 text-accent-400" />
                    </div>
                    <p className="font-bold text-text-1 text-sm mb-1">Ask AI</p>
                    <p className="text-xs text-text-3 leading-relaxed">Query your knowledge base</p>
                    <ArrowRight className="w-4 h-4 text-text-3 mt-4 group-hover:text-accent-400 group-hover:translate-x-1.5 transition-all duration-300" />
                  </Link>
                </motion.div>

                <motion.button
                  onClick={() => setShowPdfUpload(true)}
                  className="glass glass-hover rounded-2xl p-6 text-left group border border-transparent hover:border-blue-400/10"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-400/8 flex items-center justify-center mb-4 group-hover:bg-blue-400/15 transition-colors">
                    <FileUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="font-bold text-text-1 text-sm mb-1">Import PDF</p>
                  <p className="text-xs text-text-3 leading-relaxed">Extract from documents</p>
                  <ArrowRight className="w-4 h-4 text-text-3 mt-4 group-hover:text-blue-400 group-hover:translate-x-1.5 transition-all duration-300" />
                </motion.button>
              </motion.div>

              {/* Recent notes */}
              {recent.length > 0 && (
                <motion.div variants={fadeUp}>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-brand-400" />
                    <h2 className="text-sm font-bold text-text-2 uppercase tracking-widest">Recent Notes</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {recent.map((note, i) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.06 }}
                      >
                        <Link href={`/notes/${note.id}`}
                          className="glass glass-hover rounded-xl p-5 block group border border-transparent hover:border-brand-400/10">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-semibold text-text-1 truncate flex-1 flex items-center gap-2">
                              {note.is_pinned && <span className="w-2 h-2 rounded-full bg-brand-400 shrink-0" />}
                              {note.title || "Untitled"}
                            </p>
                            <span className="text-[11px] text-text-3 bg-surface-800/60 px-2 py-0.5 rounded-md ml-2 shrink-0">
                              {note.word_count ?? 0}w
                            </span>
                          </div>
                          <p className="text-xs text-text-2 line-clamp-2 mb-3 leading-relaxed">{note.content || "Empty note"}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] text-text-3">{formatDate(note.updated_at)}</p>
                            {note.tags && note.tags.length > 0 && (
                              <div className="flex gap-1.5">
                                {note.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-brand-400/8 text-brand-400 font-medium">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {notes.length === 0 && !loading && (
                <motion.div className="text-center py-20" variants={fadeUp}>
                  <div className="w-20 h-20 rounded-3xl bg-brand-400/8 border border-brand-400/10 flex items-center justify-center mx-auto mb-6 glow-brand">
                    <FileText className="w-10 h-10 text-brand-400 opacity-60" />
                  </div>
                  <h3 className="text-xl font-bold text-text-1 mb-2">No notes yet</h3>
                  <p className="text-text-2 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
                    Create your first note and start building your personal knowledge base.
                  </p>
                  <motion.button onClick={handleNewNote} whileTap={{ scale: 0.98 }}
                    className="px-8 py-3.5 btn-gradient rounded-xl text-sm font-bold">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Create first note
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </main>

      {showPdfUpload && (
        <PdfUpload onUploaded={handlePdfUploaded} onClose={() => setShowPdfUpload(false)} />
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex h-screen bg-surface-950 items-center justify-center"><Loader2 className="w-6 h-6 text-brand-400 animate-spin" /></div>}>
      <DashboardContent />
    </Suspense>
  )
}
