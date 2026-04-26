import { NextRequest, NextResponse } from "next/server"
import { getRouteUser } from "@/lib/supabase/server"
import { summarizeOllama } from "@/lib/ai"

export async function POST(req: NextRequest) {
  const { supabase, user } = await getRouteUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { noteId, type } = await req.json()
  if (!noteId || !type) return NextResponse.json({ error: "noteId and type required" }, { status: 400 })

  const { data: note, error } = await supabase
    .from("notes").select("*").eq("id", noteId).eq("user_id", user.id).single()
  if (error || !note) return NextResponse.json({ error: "Note not found" }, { status: 404 })

  try {
    const summary = await summarizeOllama(note, type)
    return NextResponse.json({ summary, type, noteId })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "AI error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
