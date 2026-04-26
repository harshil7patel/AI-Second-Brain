import { NextRequest, NextResponse } from "next/server"
import { getRouteUser } from "@/lib/supabase/server"
import { countWords } from "@/lib/utils"

type Params = { params: { id: string } }

export async function GET(req: NextRequest, { params }: Params) {
  const { supabase, user } = await getRouteUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabase
    .from("notes").select("*").eq("id", params.id).eq("user_id", user.id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { supabase, user } = await getRouteUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const updates: Record<string, unknown> = { ...body, updated_at: new Date().toISOString() }
  if (body.content) updates.word_count = countWords(body.content)

  const { data, error } = await supabase
    .from("notes").update(updates).eq("id", params.id).eq("user_id", user.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { supabase, user } = await getRouteUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { error } = await supabase
    .from("notes").delete().eq("id", params.id).eq("user_id", user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
