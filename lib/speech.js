// Pembaca suara sederhana memakai Web Speech API bawaan browser

export function canSpeak() {
    return typeof window !== "undefined" && "speechSynthesis" in window;
}

let cachedVoice = null;

function pickVoice() {
    if (cachedVoice) return cachedVoice;
    const voices = window.speechSynthesis.getVoices();
    cachedVoice = voices.find((v) => v.lang?.toLowerCase().startsWith("id")) || null;
    return cachedVoice;
}

export function speak(text) {
    if (!canSpeak()) return;
    const clean = text?.replace(/\s+/g, " ").trim();
    if (!clean) return;

    // Hentikan suara sebelumnya supaya tidak menumpuk
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(clean.slice(0, 300));
    utter.lang = "id-ID";
    const voice = pickVoice();
    if (voice) utter.voice = voice;
    window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
    if (canSpeak()) window.speechSynthesis.cancel();
}
