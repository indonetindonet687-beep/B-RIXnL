# B'RIXnL — AI Developer Assistant

Asisten AI untuk developer. Debug kode, jelaskan konsep, review PR, generate fungsi.

**Stack:** Next.js 14 · TypeScript · Gemini API · Deploy ke Vercel

---

## Deploy ke Vercel (cara termudah)

### 1. Upload ke GitHub
```bash
git init
git add .
git commit -m "init brixnl"
git remote add origin https://github.com/USERNAME/brixnl.git
git push -u origin main
```

### 2. Connect ke Vercel
- Buka [vercel.com](https://vercel.com) → New Project
- Import repo GitHub kamu
- Klik **Deploy**

### 3. Tambahkan Environment Variable di Vercel
Di dashboard Vercel → Settings → Environment Variables:
```
GEMINI_API_KEY = AIzaSy...api_key_kamu...
```
Lalu klik **Redeploy**

---

## Jalankan Lokal

```bash
# Install dependencies
npm install

# Buat file .env.local
cp .env.example .env.local
# Edit .env.local → isi GEMINI_API_KEY

# Jalankan dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Struktur Project

```
brixnl-web/
├── app/
│   ├── api/chat/route.ts   ← Gemini API (server-side, key aman)
│   ├── page.tsx            ← UI chat utama
│   ├── page.module.css     ← styling
│   ├── layout.tsx          ← root layout + fonts
│   └── globals.css         ← global styles
├── .env.example            ← template env
├── .gitignore              ← .env.local tidak ter-upload
├── next.config.js
├── package.json
└── tsconfig.json
```

## Fitur
- Chat realtime dengan Gemini AI
- Syntax highlighting code blocks
- Mode: debug / jelaskan / review / generate
- Sidebar navigasi mode
- Responsive (mobile friendly)
- API key aman di server-side (tidak exposed ke browser)
