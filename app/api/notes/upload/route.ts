import { NextRequest, NextResponse } from "next/server"
import { getRouteUser } from "@/lib/supabase/server"
import { countWords } from "@/lib/utils"
import pdf from "pdf-parse"

export async function POST(req: NextRequest) {
  const { supabase, user } = await getRouteUser(req)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 })

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const parsed = await pdf(buffer)

    const title = file.name.replace(/\.pdf$/i, "")
    const content = parsed.text.trim()

    if (!content) {
      return NextResponse.json({ error: "Could not extract text from PDF" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("notes")
      .insert({
        title,
        content,
        tags: ["pdf-import"],
        user_id: user.id,
        word_count: countWords(content),
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({
      note: data,
      pages: parsed.numpages,
      wordCount: countWords(content),
    }, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to parse PDF"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
