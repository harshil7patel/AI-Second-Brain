export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    console.log("=== CALLBACK HIT ===")
    console.log("Code:", code)
    console.log("Cookies received:", cookieStore.getAll().map(c => c.name))
    
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      console.log("Session exchanged successfully!", data.session?.user?.id)
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error("Auth callback error:", error.message)
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/login?error=auth-failed`)
}
