import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Kamu adalah B'RIXnL, asisten AI khusus untuk developer. Kamu membantu dengan:
- Debug dan fix kode
- Menjelaskan konsep programming
- Review kode dan saran perbaikan
- Generate fungsi/snippet kode

Jawab dalam bahasa Indonesia yang santai tapi informatif.
Jika jawabanmu mengandung kode, sertakan dalam format kode markdown biasa dengan backtick tiga.
Jawab singkat dan langsung ke poin. Prioritaskan contoh kode yang praktis.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API key tidak ditemukan" }, { status: 500 });
    }

    const contents = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model", parts: [{ text: "Siap! Saya B'RIXnL, asisten developer kamu. Mau mulai dari mana?" }] },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
        }),
      }
    );

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Maaf, tidak ada respons.";
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}
