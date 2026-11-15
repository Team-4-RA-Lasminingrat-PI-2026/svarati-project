"use client";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { KURATIF, MENU_UTAMA } from "@/content/labels";
import { Card } from "@/components/Card";
import EmergencyModal from "@/components/modals/EmergencyModal";
import { useQuestions } from "@/lib/self-assessment/use-questions";
import { useSvaratiChat } from "./_hooks/useSvaratiChat";
import { AiDisclaimer } from "./_components/ChatBubble";
import ChatHeader from "./_components/ChatHeader";
import UrgentAlert from "./_components/UrgentAlert";
import MessageList from "./_components/MessageList";
import ChatSuggestions from "./_components/ChatSuggestions";
import ConsentStatus from "./_components/ConsentStatus";
import ChatInput from "./_components/ChatInput";

const ai = KURATIF.ai;
const hub = MENU_UTAMA.find((menu) => menu.id === "pendampingan");

export default function SvaratiAiPage() {
  const { questions } = useQuestions();
  const chat = useSvaratiChat(questions);

  return (
    <>
      <div className="w-full px-2.5 pb-4 pt-22 min-[400px]:px-4 sm:px-5 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <Link
            href={hub.href}
            onClick={chat.confirmLeave}
            aria-label={`Kembali ke ${hub.nama}`}
            className="group mb-2 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-svarati-teal hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-svarati-teal"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            {hub.nama}
          </Link>

          <div className="lg:flex lg:h-[calc(100dvh-8.5rem)] lg:min-h-[30rem] lg:flex-col">
            {/* Judul untuk pembaca layar. Tidak tampil secara visual. */}
            <h1 className="sr-only">{ai.judulPanel}</h1>

            <section
              aria-label={ai.badge}
              className="flex h-[calc(100dvh-9rem)] min-h-[28rem] flex-col overflow-hidden rounded-3xl border border-svarati-lavender-light bg-white shadow-sm lg:h-auto lg:min-h-0 lg:flex-1"
            >
              <ChatHeader />

              {chat.showUrgent && (
                <UrgentAlert
                  onOpen={() => chat.setEmergencyOpen(true)}
                  onClose={() => chat.setShowUrgent(false)}
                />
              )}

              <MessageList
                logRef={chat.logRef}
                onScroll={chat.handleScroll}
                messages={chat.messages}
                typing={chat.typing}
                onFeedback={chat.giveFeedback}
                onReason={chat.giveReason}
              />

              <div className="shrink-0 border-t border-svarati-lavender-light p-3">
                {chat.messages.length === 1 && (
                  <ChatSuggestions
                    chips={ai.chips}
                    disabled={chat.inputLocked}
                    typing={chat.typing}
                    onSelect={chat.send}
                  />
                )}

                <ConsentStatus
                  consentReady={chat.consentReady}
                  showConsent={chat.showConsent}
                  consent={chat.consent}
                  hasUnsaved={chat.hasUnsaved}
                  expiresAt={chat.expiresAt}
                  onConsentChange={chat.handleConsentChange}
                  onSaveChat={() => chat.handleConsentChange(true)}
                  onEdit={() => chat.setChangeConsent(true)}
                />

                <ChatInput
                  value={chat.input}
                  onChange={chat.setInput}
                  onSubmit={chat.submit}
                  onKeyDown={chat.handleKeyDown}
                  disabled={chat.inputLocked}
                  typing={chat.typing}
                  placeholder={
                    chat.consentReady && chat.showConsent
                      ? "Pilih dulu pengaturan percakapan di atas"
                      : ai.inputPlaceholder
                  }
                  label={ai.inputLabel}
                  sendLabel={ai.send}
                />
              </div>
            </section>

            {/* Kartu di bawah chat, dipusatkan dan lebarnya mengikuti isi teks */}
            <Card
              variant="coral"
              size="sm"
              className="mx-auto mt-1.5 flex w-fit max-w-[95%] shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs leading-snug text-svarati-coral-dark"
            >
              <Info size={14} className="shrink-0" aria-hidden="true" />
              <span>
                <AiDisclaimer onOpenEmergency={() => chat.setEmergencyOpen(true)} />
              </span>
            </Card>
          </div>
        </div>
      </div>

      <EmergencyModal open={chat.emergencyOpen} onClose={() => chat.setEmergencyOpen(false)} />
    </>
  );
}