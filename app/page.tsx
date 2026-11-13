export default function Home() {
  return (
    <main style={{ padding: '40px 20px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        XMC Dashboard
      </h1>
      <p style={{ color: '#8b9bb4' }}>
        Next.js version ready for Vercel. Connect Supabase and deploy to go live.
      </p>
      <div style={{ marginTop: 32, background: '#1a2332', padding: 24, borderRadius: 12 }}>
        <h2>Next steps</h2>
        <ol>
          <li>Create a Supabase project and send me the URL + anon key</li>
          <li>Connect this repo to Vercel</li>
          <li>Add environment variables in Vercel</li>
        </ol>
      </div>
    </main>
  )
}
