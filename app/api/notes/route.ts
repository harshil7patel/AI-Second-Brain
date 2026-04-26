import { NextRequest, NextResponse } from "next/server"
import { getRouteUser } from "@/lib/supabase/server"
import { countWords } from "@/lib/utils"

// GET /api/notes — fetch all notes for current user
export async function GET(req: NextRequest) {
  const { supabase, user } = await getRouteUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")

  let qb = supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false })

  if (query) qb = qb.or(`title.ilike.%${query}%,content.ilike.%${query}%`)

  const { data, error } = await qb
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/notes — create new note
export async function POST(req: NextRequest) {
  const { supabase, user } = await getRouteUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { title, content, tags = [] } = body

  const { data, error } = await supabase
    .from("notes")
    .insert({ title, content, tags, user_id: user.id, word_count: countWords(content) })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
