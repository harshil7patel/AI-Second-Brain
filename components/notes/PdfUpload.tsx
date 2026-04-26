"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, Loader2, CheckCircle, X } from "lucide-react"
import toast from "react-hot-toast"

interface PdfUploadProps {
  onUploaded: (noteId: string) => void
  onClose: () => void
}

export default function PdfUpload({ onUploaded, onClose }: PdfUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large (max 10 MB)")
      return
    }

    setUploading(true)
    setProgress("Extracting text from PDF…")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/notes/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setProgress(`✓ Created note from ${data.pages} pages (${data.wordCount} words)`)
      toast.success("PDF imported successfully!")

      setTimeout(() => {
        onUploaded(data.note.id)
      }, 800)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Upload failed"
      toast.error(msg)
      setProgress("")
      setUploading(false)
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="glass rounded-2xl p-6 w-full max-w-md mx-4 border-glow"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-400/10 border border-blue-400/15 flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-text-1">Import PDF</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-700 text-text-3 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`
              border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300
              ${dragOver
                ? "border-brand-400/50 bg-brand-400/5 shadow-lg shadow-brand-400/5"
                : "border-border hover:border-text-3 hover:bg-surface-800/30"
              }
            `}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              onChange={onFileChange}
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-400/10 border border-brand-400/15 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-brand-400 animate-spin" />
                </div>
                <p className="text-sm text-text-2 font-medium">{progress}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-text-3" />
                </div>
                <div>
                  <p className="text-sm text-text-1 font-semibold mb-1">
                    Drop a PDF here or click to browse
                  </p>
                  <p className="text-xs text-text-3">Max 10 MB · Text will be extracted automatically</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
