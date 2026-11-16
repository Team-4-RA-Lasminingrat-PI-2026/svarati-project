import { Message, TypingIndicator } from "./ChatBubble";
import ReferenceList from "./ReferenceList";
import FeedbackBar from "./FeedbackBar";

export default function MessageList({ logRef, onScroll, messages, typing, onFeedback, onReason }) {
  return (
    <div
      ref={logRef}
      onScroll={onScroll}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4 sm:p-6"
    >
      {messages.map((m) => (
        <div key={m.id} className="flex flex-col gap-2">
          <Message from={m.from} text={m.text} />
          {m.from === "bot" && <ReferenceList items={m.references} />}
          {m.from === "bot" && <FeedbackBar msg={m} onSelect={onFeedback} onReason={onReason} />}
        </div>
      ))}
      {typing && <TypingIndicator />}
    </div>
  );
}