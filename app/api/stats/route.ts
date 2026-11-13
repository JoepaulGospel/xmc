import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const room = searchParams.get('room') || 'default'

  const { data: trades, error } = await supabase
    .from('trades')
    .select('*')
    .eq('room', room)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!trades || trades.length === 0) {
    return NextResponse.json({ room, summary: {}, leaderboard: [] })
  }

  const profits = trades.map(t => Number(t.profit) || 0)
  const net = profits.reduce((a, b) => a + b, 0)
  const wins = profits.filter(p => p > 0)
  const losses = profits.filter(p => p < 0)
  const total = trades.length
  const winrate = total ? wins.length / total : 0
  const pf = losses.length ? wins.reduce((a,b)=>a+b,0) / Math.abs(losses.reduce((a,b)=>a+b,0)) : (wins.length ? 999 : 0)
  const avgHold = trades.reduce((a, t) => a + (t.duration_sec || 0), 0) / total

  const byTrader: Record<string, any> = {}
  trades.forEach(t => {
    const name = t.trader
    if (!byTrader[name]) byTrader[name] = { trades: 0, net: 0, wins: 0, holds: [] }
    byTrader[name].trades++
    byTrader[name].net += Number(t.profit) || 0
    if (Number(t.profit) > 0) byTrader[name].wins++
    byTrader[name].holds.push(t.duration_sec || 0)
  })

  const leaderboard = Object.entries(byTrader).map(([trader, d]) => ({
    trader,
    net: d.net,
    trades: d.trades,
    winrate: d.trades ? d.wins / d.trades : 0,
    avg_hold: d.holds.length ? d.holds.reduce((a:number,b:number)=>a+b,0)/d.holds.length : 0
  })).sort((a, b) => b.net - a.net)

  const summary = {
    total,
    net,
    winrate,
    wins: wins.length,
    losses: losses.length,
    pf,
    avg_hold: avgHold,
    avg_win: wins.length ? wins.reduce((a,b)=>a+b,0)/wins.length : 0,
    avg_loss: losses.length ? losses.reduce((a,b)=>a+b,0)/losses.length : 0
  }

  return NextResponse.json({ room, summary, leaderboard })
}
