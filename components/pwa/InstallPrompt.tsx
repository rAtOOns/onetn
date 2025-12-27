"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);

    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user dismissed before
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Show iOS prompt after a delay if not installed
    if (ios && !standalone) {
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg md:bottom-4 md:left-4 md:right-auto md:max-w-sm md:rounded-xl md:border">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <X size={20} />
      </button>

      <div className="flex items-start gap-4 pr-6">
        <div className="flex-shrink-0 p-2 bg-tn-primary/10 rounded-lg">
          <Smartphone className="text-tn-primary" size={24} />
        </div>
        <div>
          <h3 className="font-semibold text-tn-text mb-1">Install One TN App</h3>
          <p className="text-sm text-gray-600 mb-3">
            {isIOS
              ? "Tap the share button and 'Add to Home Screen' for quick access"
              : "Get quick access to documents with our app"}
          </p>

          {isIOS ? (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>Tap</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v6.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 9.586V3a1 1 0 011-1z" />
                <path d="M3 13a2 2 0 012-2h2a1 1 0 010 2H5v4h10v-4h-2a1 1 0 010-2h2a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4z" />
              </svg>
              <span>then &quot;Add to Home Screen&quot;</span>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Download size={16} />
              Install App
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
