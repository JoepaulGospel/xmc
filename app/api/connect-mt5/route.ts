import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { login, password, server } = await request.json()
  const apiKey = process.env.METATRADERAPI_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'METATRADERAPI_KEY not set in Vercel' }, { status: 500 })
  }

  try {
    const url = new URL('https://api.metatraderapi.net/ConnectEx')
    url.searchParams.set('user', login)
    url.searchParams.set('password', password)
    url.searchParams.set('server', server)
    url.searchParams.set('platform', 'MT5')
    url.searchParams.set('wait', '60')

    const res = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    })

    const data = await res.json()

    if (!res.ok || !data.id) {
      return NextResponse.json({ error: data.message || 'Connection failed' }, { status: 400 })
    }

    return NextResponse.json({
      status: 'connected',
      accountId: data.id,
      apiKey: data.apiKey,
      server: data.brokerServer
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
