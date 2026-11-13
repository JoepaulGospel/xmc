import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const { action, code, trader } = await request.json()

  if (action === 'create') {
    const newCode = 'XMC-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    const { error } = await supabase.from('rooms').insert({ code: newCode, created_by: trader || 'unknown' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ code: newCode })
  }

  if (action === 'join') {
    const { error } = await supabase.from('room_members').upsert({ room_code: code, trader })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ status: 'joined', code })
  }

  return NextResponse.json({ error: 'invalid action' }, { status: 400 })
}
