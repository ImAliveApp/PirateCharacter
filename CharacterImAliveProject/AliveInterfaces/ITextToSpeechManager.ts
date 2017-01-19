interface ITextToSpeechManager {
    setLanguage(language: string): void;
    say(textToSay: string): void;
    setPitch(pitch: number): void;
    setSpeechRate(speechRate: number): void;
    setVoice(index: number): void;

    getMaxSpeechInputLength(): number;
    getVoices(): IVoice[];
    getCurrentVoice(): IVoice;
    isSpeaking(): boolean;
};