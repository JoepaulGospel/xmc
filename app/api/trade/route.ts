import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const data = await request.json()

  const { error } = await supabase.from('trades').insert({
    trader: data.trader || 'Unknown',
    room: data.room || 'default',
    symbol: data.symbol,
    type: data.type,
    volume: data.volume,
    profit: data.profit,
    open_time: data.open_time,
    close_time: data.close_time,
    duration_sec: data.duration_sec,
    ticket: data.ticket,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ status: 'ok' })
}
