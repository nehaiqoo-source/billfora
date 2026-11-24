# BillFora mobile

Expo app that uses the same BillFora account as the web app. Auth is a Bearer JWT from `POST /api/auth/token` (cookies don’t work well on native).

## Run

1. Start the web API: from the repo root, `npm run dev`
2. In this folder: `npm start`, then open iOS Simulator / Android emulator / Expo Go

```bash
# emulator running + web API on :3000
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3000 tcp:3000
npm run android
```

Android uses `http://127.0.0.1:3000` with those `adb reverse` tunnels (or set `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`).

On a physical phone:

```bash
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000 npm start
```

## What’s in this build

- Sign in with email/password (defaults to https://billfora.vercel.app)
- Invoice list (pull to refresh)
- **New invoice** (client, line item, dates, draft/sent)
- Invoice detail + mark draft / sent / paid
