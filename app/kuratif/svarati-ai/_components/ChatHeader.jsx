import { KURATIF } from "@/content/labels";
import { BotAvatar } from "./ChatBubble";

const ai = KURATIF.ai;

export default function ChatHeader() {
  return (
    <header className="flex shrink-0 items-center gap-2.5 border-b border-svarati-lavender-light bg-svarati-lavender-light/50 px-3 py-1.5 sm:px-4">
      <BotAvatar />
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-tight text-svarati-teal">{ai.nama}</p>
        <p className="text-[11px] leading-tight text-svarati-lavender-dark">{ai.headerSub}</p>
      </div>
    </header>
  );
}