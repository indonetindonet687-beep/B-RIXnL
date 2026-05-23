"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

type Message = { role: "user" | "assistant"; content: string };

const CHIPS = [
  { label: "debug kode", hint: "Tolong debug kode ini:\n\n" },
  { label: "jelaskan konsep", hint: "Jelaskan konsep " },
  { label: "review kode", hint: "Review kode ini:\n\n" },
  { label: "generate fungsi", hint: "Buatkan fungsi untuk " },
];

function renderContent(text: string) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const lines = part.slice(3, -3).split("\n");
      const lang = lines[0].trim();
      const code = lines.slice(1).join("\n");
      return (
        <pre key={i}>
          {lang && <span className={styles.codeLang}>{lang}</span>}
          <code>{code}</code>
        </pre>
      );
    }
    return <span key={i} style={{ whiteSpace: "pre-wrap" }}>{part}</span>;
  });
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Halo! Saya B'RIXnL, asisten AI untuk developer. Bisa bantu debug, jelaskan konsep, review kode, atau generate fungsi. Mau mulai dari mana?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeChip, setActiveChip] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.text ?? "Maaf, ada kesalahan." }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Koneksi gagal. Coba lagi ya." }]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoMark}>Bx</div>
          <div>
            <div className={styles.appName}>B'RIXnL</div>
            <div className={styles.appSub}>dev assistant · ai</div>
          </div>
          <div className={styles.onlineDot} />
        </div>

        <nav className={styles.nav}>
          <div className={styles.navLabel}>Mode</div>
          {CHIPS.map((c, i) => (
            <button
              key={c.label}
              className={`${styles.navItem} ${activeChip === i ? styles.navItemActive : ""}`}
              onClick={() => { setActiveChip(i); setInput(c.hint); inputRef.current?.focus(); }}
            >
              <span className={styles.navDot} />
              {c.label}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.footerTag}>powered by Gemini</div>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.chatArea}>
          {messages.map((m, i) => (
            <div key={i} className={`${styles.msgRow} ${m.role === "user" ? styles.msgUser : styles.msgAi}`}>
              {m.role === "assistant" && <div className={styles.aiAvatar}>Bx</div>}
              <div className={styles.bubble}>
                {renderContent(m.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div className={`${styles.msgRow} ${styles.msgAi}`}>
              <div className={styles.aiAvatar}>Bx</div>
              <div className={styles.bubble}>
                <div className={styles.typing}>
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className={styles.inputWrap}>
          <div className={styles.inputBox}>
            <textarea
              ref={inputRef}
              className={styles.textarea}
              placeholder="tanya sesuatu... (Shift+Enter untuk baris baru)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={1}
            />
            <button className={styles.sendBtn} onClick={() => send()} disabled={loading || !input.trim()}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>
          <div className={styles.inputHint}>Enter untuk kirim · Shift+Enter baris baru</div>
        </div>
      </main>
    </div>
  );
}
