import { KURATIF } from "@/content/labels";
import LinkifiedText from "./LinkifiedText";

const ai = KURATIF.ai;
const EMERGENCY_PHRASE = "Bantuan Darurat";

// Palet chat: teal sebagai warna dasar (bubble), lavender sebagai pelengkap interaksi
// (input, chip, titik mengetik), coral sebagai aksen hangat (avatar, disclaimer).

// Avatar kecil di samping pesan bot, dan di header chat
export function BotAvatar({ large = false }) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-svarati-coral-soft ${
        large ? "h-8 w-8" : "h-7 w-7"
      }`}
    >
      <img
        src="/cute-ai-mascot.svg"
        alt=""
        className={large ? "h-6 w-6" : "h-5 w-5"}
      />
    </span>
  );
}

// Satu pesan. Bot: teal lembut, tautan nomor dan email aktif. Pengguna: lavender lembut.
export function Message({ from, text }) {
  const isBot = from === "bot";
  return (
    <div className={`flex gap-3 ${isBot ? "" : "justify-end"}`}>
      {isBot && <BotAvatar />}
      <p
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-[15px] leading-normal ${
          isBot
            ? "rounded-bl-sm bg-svarati-teal-soft text-svarati-teal"
            : "rounded-br-sm bg-svarati-lavender-light text-svarati-lavender-dark"
        }`}
      >
        {isBot ? <LinkifiedText text={text} /> : text}
      </p>
    </div>
  );
}

// Tiga titik di dalam bubble bot, muncul saat balasan belum datang
export function TypingIndicator() {
  return (
    <div className="flex gap-3" role="status">
      <BotAvatar />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-svarati-teal-soft px-4 py-2.5">
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
// Memakai indexOf agar aman walau frasa muncul lebih dari sekali.
export function AiDisclaimer({ onOpenEmergency }) {
  const text = KURATIF.common.aiDisclaimer;
  const i = text.indexOf(EMERGENCY_PHRASE);
  if (i === -1) return text;

  return (
    <>
      {text.slice(0, i)}
      <button
        type="button"
        onClick={onOpenEmergency}
        className="cursor-pointer font-semibold underline underline-offset-2"
      >
        {EMERGENCY_PHRASE}
      </button>
      {text.slice(i + EMERGENCY_PHRASE.length)}
    </>
  );
}