"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Brain } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Client auth error:", error)
        setErrorMsg(error.message)
        setTimeout(() => router.replace("/login?error=auth-failed"), 2000)
        return
      }
      
      if (data?.session) {
        router.replace("/dashboard")
      } else {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            router.replace("/dashboard")
          }
        })
        
        setTimeout(() => {
          router.replace("/login?error=auth-timeout")
        }, 5000)
        
        return () => {
          authListener.subscription.unsubscribe()
        }
      }
    })
  }, [router])

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center gap-5 relative overflow-hidden">
      <div className="orb orb-cyan absolute top-[-200px] right-[-100px] animate-orb-float" />
      <div className="orb orb-purple absolute bottom-[-150px] left-[-100px] animate-orb-float-2" />
      
      {errorMsg ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass px-8 py-6 rounded-2xl border-glow text-center max-w-sm"
        >
          <p className="font-bold text-red-400 mb-2">Authentication failed</p>
          <p className="text-sm text-text-2">{errorMsg}</p>
        </motion.div>
      ) : (
        <motion.div
          className="flex flex-col items-center gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-brand-400/10 border border-brand-400/20 flex items-center justify-center glow-brand"
            animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain className="w-8 h-8 text-brand-400" />
          </motion.div>
          <div className="text-center">
            <p className="text-text-1 font-semibold mb-1">Completing sign in…</p>
            <p className="text-text-3 text-sm">Please wait while we set up your session</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
