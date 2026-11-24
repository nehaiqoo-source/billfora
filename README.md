# BillFora

Invoice app for businesses that sell in more than one country’s tax format. Same account on web, mobile, and desktop.

## What’s in this repo

- Email signup and sign-in (Auth.js)
- Per-user data in Prisma (SQLite for local; set `DATABASE_URL` to Postgres for production)
- Business setup with 15 country packs
- Create, list, view, and mark invoices paid
- Free plan: 15 invoices per month
- Mobile app (`mobile/`) — Expo, Bearer token login, invoice list + detail
- Desktop shell (`desktop/`) — Electron window around the web app
- `/account` shows plan stubs (Razorpay still last)

## Quick start

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and create an account.

## Live

Production: [https://billfora.vercel.app](https://billfora.vercel.app)

Demo login: `demo@billfora.app` / `demo1234`

Postgres is on Prisma’s create-db (claim it so it is not deleted after 24h).

### Mobile

```bash
cd mobile && npm install && npm start
```

Needs the web API running. See `mobile/README.md` for device / LAN URLs.

### Desktop

```bash
cd desktop && npm install && npm run dev
```

Opens localhost:3000 in an Electron window. See `desktop/README.md`.

## Surfaces

| Surface | Status |
| --- | --- |
| Web app | Ready |
| Mobile (Expo iOS + Android) | Login + invoices in `mobile/` |
| Desktop (Electron) | Shell in `desktop/` |
| Razorpay subscriptions | Stub on `/account` — do this last |

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
