import { NextRequest, NextResponse } from "next/server"
import { getRouteUser } from "@/lib/supabase/server"
import { askOllama } from "@/lib/ai"

export async function POST(req: NextRequest) {
  const { supabase, user } = await getRouteUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { question } = await req.json()
  if (!question) return NextResponse.json({ error: "question required" }, { status: 400 })

  const { data: notes, error } = await supabase
    .from("notes").select("*").eq("user_id", user.id).limit(20)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!notes?.length) return NextResponse.json({ answer: "You have no notes yet! Create some notes first, then ask me questions about them." })

  try {
    const answer = await askOllama(question, notes)
    return NextResponse.json({ answer })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "AI error"
    console.error("Ollama ask error:", msg)
    return NextResponse.json({ error: `AI error: ${msg}. Make sure Ollama is running (ollama serve) and the model is pulled (ollama pull llama3).` }, { status: 500 })
  }
}