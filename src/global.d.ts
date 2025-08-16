// src/global.d.ts
export {};
declare global {
  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  }
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}