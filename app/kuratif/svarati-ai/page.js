"use client";
import { useEffect, useRef, useState } from "react";
import { Info, Send, ShieldAlert } from "lucide-react";
import { KURATIF } from "@/content/labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/Card";
import Badge from "@/components/Badge";
import EmergencyModal from "@/components/modals/EmergencyModal";
import Split from "@/components/kuratif/Split";
import {
  AiDisclaimer,
  BotAvatar,
  Message,
  TypingIndicator,
} from "@/components/kuratif/ChatBubble";

const ai = KURATIF.ai;

const DUMMY_DELAY = 800; // jeda "mengetik" dummy (ms)
const MAX_LENGTH = 500;
const COUNTER_FROM = 400;

// Daftar kata ini harus direview bersama tim pendamping.
const URGENT_PATTERN = /bunuh diri|ingin mati|dipukul|diancam|bahaya|tidak aman/i;

// Balasan dummy. Nanti diganti dengan panggilan ke /api/chat.
async function getBotReply({ key = "default" }) {
  await new Promise((resolve) => setTimeout(resolve, DUMMY_DELAY));
  return ai.replies[key] ?? ai.replies.default;
}

export default function SvaratiAiPage() {
  const [messages, setMessages] = useState([{ id: 0, from: "bot", text: ai.greeting }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showUrgent, setShowUrgent] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  const logRef = useRef(null);
  const stickRef = useRef(true); // true = pengguna sedang di dasar percakapan
  const busyRef = useRef(false); // mencegah kirim ganda sebelum state berubah
  const idRef = useRef(1);

  // Gulir ke pesan terbaru, kecuali pengguna sedang membaca pesan lama
  useEffect(() => {
    const el = logRef.current;
    if (!el || !stickRef.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, typing]);

  function handleScroll(e) {
    const el = e.currentTarget;
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  async function send(text, key = "default") {
    const trimmed = text.trim();
    if (!trimmed || busyRef.current) return;

    busyRef.current = true;
    stickRef.current = true;
    if (URGENT_PATTERN.test(trimmed)) setShowUrgent(true);

    const urgent = URGENT_PATTERN.test(trimmed);
    if (urgent) setShowUrgent(true);
    
    setMessages((m) => [...m, { id: idRef.current++, from: "user", text: trimmed }]);
    setTyping(true);

    try {
      const reply = await getBotReply({ key });
      setMessages((m) => [...m, { id: idRef.current++, from: "bot", text: reply }]);
    } catch {
      setMessages((m) => [...m, { id: idRef.current++, from: "bot", text: ai.errorText }]);
    } finally {
      busyRef.current = false;
      setTyping(false);
    }
  }

  function submit(e) {
    e.preventDefault();
    if (!input.trim() || typing) return;
    const text = input;
    setInput("");
    send(text);
  }

  // Enter langsung kirim. Shift + Enter untuk baris baru.
  // isComposing dicek agar Enter saat menyusun huruf (IME) tidak ikut mengirim.
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      submit(e);
    }
  }

  return (
    <>
      <Split
        sembunyikanAsideDiMobile
        aside={
          <>
            <Badge variant="teal">{ai.badge}</Badge>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-svarati-teal">
              {ai.judulPanel}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-svarati-teal">
              {KURATIF.menu.desc["svarati-ai"]}
            </p>
          </>
        }
      >
        {/* Mobile: kotak chat setinggi layar penuh dikurangi navbar, tautan kembali, dan jarak (9rem),
            sehingga kolom input terlihat di dasar layar. Disclaimer ada di bawahnya, terlihat saat halaman di-scroll.
            Desktop: pembungkus setinggi layar dikurangi padding Split (8,5rem), disclaimer ikut di dalamnya. */}
        <div className="lg:flex lg:h-[calc(100dvh-8.5rem)] lg:min-h-[36rem] lg:flex-col">
          {/* Di mobile panel kiri disembunyikan, jadi judul halaman disediakan untuk pembaca layar */}
          <h1 className="sr-only lg:hidden">{ai.judulPanel}</h1>

          <section
            aria-label={ai.badge}
            className="flex h-[calc(100dvh-9rem)] min-h-[28rem] flex-col overflow-hidden rounded-3xl border border-svarati-lavender-light bg-white shadow-sm lg:h-auto lg:min-h-0 lg:flex-1"
          >
            {/* Header chat: di mobile "Svarati AI", di desktop judul khusus */}
            <header className="flex shrink-0 items-center gap-3 border-b border-svarati-lavender-light bg-svarati-lavender-light/50 px-4 py-2.5 sm:px-5">
              <BotAvatar large />
              <div>
                <p className="text-sm font-semibold leading-tight text-svarati-teal">
                  <span className="lg:hidden">{ai.nama}</span>
                  <span className="hidden lg:inline">{ai.headerJudul}</span>
                </p>
                <p className="text-xs text-svarati-lavender-dark">{ai.headerSub}</p>
              </div>
            </header>

            {showUrgent && (
              <div
                role="alert"
                className="flex shrink-0 flex-col gap-3 border-b-2 border-svarati-danger bg-svarati-danger-soft p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <p className="flex items-start gap-2 text-sm text-svarati-danger">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{ai.urgentNotice}</span>
                </p>
                <Button variant="exit" size="lg" onClick={() => setEmergencyOpen(true)}>
                  {KURATIF.common.emergencyLabel}
                </Button>
              </div>
            )}

            <div
              ref={logRef}
              onScroll={handleScroll}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4 sm:p-6"
            >
              {messages.map((m) => (
                <Message key={m.id} from={m.from} text={m.text} />
              ))}
              {typing && <TypingIndicator />}
            </div>

            <div className="shrink-0 border-t border-svarati-lavender-light p-3 sm:p-4">
              {/* Chip saran hanya tampil sebelum pesan pertama */}
              {messages.length === 1 && (
                <div className="mb-3 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
                  {ai.chips.map((chip) => (
                    <Button
                      key={chip.key}
                      variant="ghost"
                      size="lg"
                      className="shrink-0 border-svarati-lavender-light bg-white text-sm text-svarati-teal hover:bg-svarati-lavender-light/40"
                      disabled={typing}
                      onClick={() => send(chip.label, chip.key)}
                    >
                      {chip.label}
                    </Button>
                  ))}
                </div>
              )}

              <form onSubmit={submit} className="flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <Input
                    variant="textarea"
                    tone="accent"
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={MAX_LENGTH}
                    placeholder={ai.inputPlaceholder}
                    aria-label={ai.inputLabel}
                    className="field-sizing-content max-h-36 min-h-12 resize-none rounded-2xl py-3 placeholder:text-svarati-lavender-dark/80"
                  />
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="h-12 shrink-0 rounded-full bg-svarati-teal px-5 text-white hover:bg-svarati-teal-light disabled:bg-svarati-teal disabled:opacity-40"
                  icon={<Send aria-hidden="true" />}
                  iconPosition="right"
                  disabled={!input.trim() || typing}
                >
                  {ai.send}
                </Button>
              </form>

              {input.length >= COUNTER_FROM && (
                <p className="mt-2 text-right text-xs text-svarati-coral-dark">
                  {input.length}/{MAX_LENGTH}
                </p>
              )}
            </div>
          </section>

          <Card variant="coral" className="mt-3 flex items-start gap-2 p-4 text-sm text-svarati-coral-dark">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              <AiDisclaimer onOpenEmergency={() => setEmergencyOpen(true)} />
            </span>
          </Card>
        </div>
      </Split>

      <EmergencyModal open={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </>
  );
}