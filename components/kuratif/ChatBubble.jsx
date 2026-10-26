import { Heart } from "lucide-react";
import { KURATIF } from "@/content/labels";

const ai = KURATIF.ai;
const DARURAT_PHRASE = "Bantuan Darurat";

// Palet chat: teal sebagai warna dasar (bubble), lavender sebagai pelengkap interaksi
// (input, chip, titik mengetik), coral sebagai aksen hangat (avatar, disclaimer).

// Avatar kecil di samping pesan bot, dan di header chat
export function BotAvatar({ large = false }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-svarati-coral-soft text-svarati-coral-dark ${
        large ? "h-8 w-8" : "h-7 w-7"
      }`}
    >
      <Heart className={large ? "h-4 w-4" : "h-3.5 w-3.5"} />
    </span>
  );
}

// Satu pesan. Bot: teal lembut. Pengguna: lavender lembut.
export function Message({ from, text }) {
  const isBot = from === "bot";
  return (
    <div className={`flex gap-3 ${isBot ? "" : "justify-end"}`}>
      {isBot && <BotAvatar />}
      <p
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
          isBot
            ? "rounded-bl-sm bg-svarati-teal-soft text-svarati-teal"
            : "rounded-br-sm bg-svarati-lavender-light text-svarati-lavender-dark"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

// Tiga titik di dalam bubble bot, muncul saat balasan belum datang
export function TypingIndicator() {
  return (
    <div className="flex gap-3" role="status">
      <BotAvatar />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-svarati-teal-soft px-4 py-4">
        <span className="sr-only">{ai.typing}</span>
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            aria-hidden="true"
            style={{ animationDelay: `${delay}ms` }}
            className="h-2 w-2 rounded-full bg-svarati-lavender-dark/60 motion-safe:animate-bounce"
          />
        ))}
      </div>
    </div>
  );
}

// Disclaimer dengan frasa "Bantuan Darurat" sebagai tombol pembuka modal.
// Jika frasa itu hilang dari teks, disclaimer tampil tanpa tombol.
export function AiDisclaimer({ onOpenEmergency }) {
  const text = KURATIF.common.aiDisclaimer;
  const [before, after] = text.split(DARURAT_PHRASE);
  if (after === undefined) return text;

  return (
    <>
      {before}
      <button
        type="button"
        onClick={onOpenEmergency}
        className="cursor-pointer font-semibold underline underline-offset-2"
      >
        {DARURAT_PHRASE}
      </button>
      {after}
    </>
  );
}