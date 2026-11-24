# BillFora

Country-aware invoice generator. Pick your country in setup; invoices use that country’s tax labels, currency, date format, invoice title, address order, and legal note.

Data stays in the browser (`localStorage`). No database or env vars required for the MVP.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

1. Go to **Setup** and choose your country (and fill in business details).
2. Create an invoice under **New invoice**.
3. Open the invoice and use **Print / PDF** (`window.print`).

## MVP countries

`IN`, `US`, `GB`, `AE`, `SG`, `AU`, `CA`, `DE`, `FR`, `NL`, `SA`, `ZA`, `BR`, `JP`, `NZ`

India GST: CGST + SGST for intra-state; check **Interstate** for IGST.

Invoice number prefixes follow the country pack (`INV-`, `RE-` for DE, `FAC-` for FR/NL, `NF-` for BR).

## Scripts

| Command        | What it does              |
| -------------- | ------------------------- |
| `npm run dev`  | Local Next.js dev server  |
| `npm run build`| Production build          |
| `npm start`    | Serve the production build|

## Deploy (Vercel)

Import the GitHub repo in Vercel. Framework preset: Next.js. Leave environment variables empty. Deploy.

Primary repo: https://github.com/nehaiqoo-source/billfora
