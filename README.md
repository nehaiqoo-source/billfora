# BillFora

Country-aware invoice SaaS: **web now**, **desktop (Mac/Windows) next** — same login account.

## What works today

- Email signup / sign in (Auth.js)
- Cloud database (Prisma + SQLite locally; switch `DATABASE_URL` to Postgres in production)
- Business setup with 15 country packs
- Create / list / view / mark-paid invoices (per-user)
- Free plan limit: **15 invoices / month**
- Account page with plan stubs (Razorpay next)

## Quick start

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **Create free account**.

## Product shape

| Surface | Status |
| --- | --- |
| Web app | Ready (this repo) |
| Desktop Mac/Windows | Electron/Tauri wrapper + license check (same auth) |
| Razorpay subscriptions | Stub on `/account` |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local Next.js + API |
| `npm run build` | Production build |
| `npx prisma studio` | Browse DB |

## Deploy

1. Set `DATABASE_URL` (Postgres) and `AUTH_SECRET`
2. `npx prisma migrate deploy`
3. Deploy to Vercel
