# XMC — Trading Dashboard + Leaderboard

Auto-sync trades from MT5 / Exness and track performance with private rooms and leaderboards.

## Status
Prototype ready. Local testing works; preparing for Vercel deployment.

## Current files
- `XMC_Sender.mq5` — EA that automatically sends closed trades
- `xmc_server.py` — Local Flask server for testing the dashboard + leaderboard

## Vercel plan
This repo will be converted to a Next.js app so it deploys cleanly on Vercel.
Auto-connect via Exness read-only password will use a secure server-side connector (or official Exness API).

## Quick local test
1. `pip install flask`
2. `python xmc_server.py`
3. Attach the EA in MT5 (whitelist `http://127.0.0.1:5000`)

Repo: https://github.com/JoepaulGospel/xmc
