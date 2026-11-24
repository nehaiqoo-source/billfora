# BillFora

Invoice app for businesses that sell in more than one country’s tax format. The web app is ready; Mac and Windows desktop builds will use the same login.

## What’s in this repo

- Email signup and sign-in (Auth.js)
- Per-user data in Prisma (SQLite for local; set `DATABASE_URL` to Postgres for production)
- Business setup with 15 country packs
- Create, list, view, and mark invoices paid
- Free plan: 15 invoices per month
- `/account` shows plan stubs (Razorpay checkout not wired yet)

## Quick start

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and create an account.

## Surfaces

| Surface | Status |
| --- | --- |
| Web app | Ready in this repo |
| Desktop (Mac / Windows) | Planned: Electron or Tauri wrapper with the same auth |
| Razorpay subscriptions | Stub UI on `/account` |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local Next.js + API |
| `npm run build` | Production build |
| `npx prisma studio` | Browse the database |

## Deploy

1. Set `DATABASE_URL` (Postgres) and `AUTH_SECRET`
2. Run `npx prisma migrate deploy`
3. Deploy on Vercel (or similar)
