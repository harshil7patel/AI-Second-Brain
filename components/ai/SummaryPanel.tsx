"use client"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion } from "framer-motion"
import { Sparkles, Loader2, X } from "lucide-react"

const TYPES = [
  { key: "2-mark",  label: "2-Mark",  desc: "~60 words" },
  { key: "5-mark",  label: "5-Mark",  desc: "~150 words" },
  { key: "10-mark", label: "10-Mark", desc: "~300 words" },
] as const

type SType = typeof TYPES[number]["key"]

export default function SummaryPanel({ noteId, onClose }: { noteId: string; onClose: () => void }) {
  const [active, setActive]   = useState<SType>("5-mark")
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState<string | null>(null)
  const [error, setError]     = useState<string | null>(null)

  async function generate() {
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId, type: active }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data.summary)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-b border-border glass-sidebar px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent-400/10 border border-accent-400/15 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
          </div>
          <span className="text-sm font-bold text-text-1">AI Summary</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-700 text-text-3 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {TYPES.map(t => (
          <motion.button key={t.key} onClick={() => { setActive(t.key); setResult(null) }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
              active === t.key
                ? "bg-accent-400/15 text-accent-400 border-accent-400/20 shadow-lg shadow-accent-400/5"
                : "bg-surface-800/40 text-text-2 hover:bg-surface-700/60 border-transparent"
            }`}
            whileTap={{ scale: 0.96 }}
          >
            {t.label} <span className="opacity-60 ml-1">{t.desc}</span>
          </motion.button>
        ))}
        <motion.button onClick={generate} disabled={loading}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl btn-gradient text-xs font-bold disabled:opacity-60"
          whileTap={{ scale: 0.96 }}>
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          Generate
        </motion.button>
      </div>

      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-5 prose-brain max-h-48 overflow-y-auto border border-surface-700"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
        </motion.div>
      )}
    </div>
  )
}
