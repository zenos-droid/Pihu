import React, { useState } from "react";
import { X, Check, HelpCircle, Flame, Heart, Star, Sparkles, Award } from "lucide-react";

interface RedemptionLog {
  timestamp: string;
  note: string;
}

interface SurpriseModalProps {
  pass: any;
  isOpen: boolean;
  onClose: () => void;
  onRedeem: (note: string) => Promise<void>;
  isRedeeming: boolean;
}

export default function SurpriseModal({
  pass,
  isOpen,
  onClose,
  onRedeem,
  isRedeeming
}: SurpriseModalProps) {
  const [whisper, setWhisper] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen || !pass) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      await onRedeem(whisper);
      setWhisper(""); // clear input on success
    } catch (err: any) {
      setErrorMessage(err?.message || "Could not redeem at this moment.");
    }
  };

  const getPassBadgeTheme = (templateId: string) => {
    switch (templateId) {
      case "luxury":
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950";
      case "celestial":
        return "bg-gradient-to-r from-amber-300 to-amber-400 text-stone-900";
      case "neon":
        return "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white";
      default:
        return "bg-gradient-to-r from-rose-500 to-pink-500 text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-stone-950/70">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-stone-800 bg-stone-950 p-6 md:p-8 shadow-2xl text-stone-200"
        style={{
          boxShadow: "0 0 50px rgba(183, 110, 121, 0.15)"
        }}
      >
        {/* Subtle royal framing lines */}
        <div className="absolute inset-2 rounded-2xl border border-stone-800/60 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 rounded-full bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-all hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold mb-3 ${getPassBadgeTheme(pass.templateId)}`}>
            ⭐ Authentic Royal Vow Certificate ⭐
          </span>
          <h2 className="text-2xl md:text-3xl font-serif text-stone-100 mt-1">
            {pass.title}
          </h2>
          <p className="font-serif italic text-rose-300/80 text-sm mt-1">
            &ldquo;{pass.subtitle}&rdquo;
          </p>
        </div>

        {/* Outer details content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start mt-4">
          
          {/* Privileges Side */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-stone-900/60 border border-stone-800/40 rounded-2xl p-5">
              <h3 className="text-xs uppercase tracking-wider text-rose-300 font-semibold mb-3">
                Granted Privileges & Terms
              </h3>
              <ul className="space-y-2.5">
                {pass.description.split("\n").map((line: string, i: number) => (
                  <li key={i} className="text-sm text-stone-300 leading-relaxed flex items-start gap-2">
                    <span className="text-rose-400 shrink-0 mt-1">❤</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Custom Quote in cursive scroll */}
            <div className="bg-stone-900/30 border border-dashed border-rose-900/30 rounded-2xl p-5 text-center">
              <h4 className="text-[10px] uppercase text-stone-500 tracking-widest mb-1.5">
                Ayush's Dedication
              </h4>
              <p className="font-serif text-lg italic text-rose-200/90 leading-snug">
                &ldquo;{pass.customQuote}&rdquo;
              </p>
            </div>
          </div>

          {/* Action summons Side */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-rose-950/50 rounded-2xl p-5 text-center">
              <h3 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-2">
                Launch Activation
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-left">
                  <label className="block text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                    Add a redeemer whisper
                  </label>
                  <textarea
                    placeholder="E.g., Sweet pancakes tonight? / Meet me in 5 minutes! ❤️"
                    value={whisper}
                    onChange={(e) => setWhisper(e.target.value)}
                    maxLength={150}
                    rows={2}
                    className="w-full text-xs rounded-xl bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-rose-800 resize-none p-2.5"
                  />
                </div>

                {errorMessage && (
                  <p className="text-[11px] text-red-400 bg-red-950/20 px-2 py-1.5 rounded">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={isRedeeming}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-stone-950 bg-gradient-to-r from-rose-300 via-amber-200 to-rose-300 hover:shadow-[0_0_20px_rgba(244,197,204,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRedeeming ? "Summoning..." : "Redeem & Summon Ayush 💖"}
                </button>
              </form>

              <div className="mt-3 text-[9px] text-stone-500">
                ⭐ Pressing this launches a live starlight notification & logs this vow!
              </div>
            </div>
          </div>
        </div>

        {/* Sync log lists */}
        <div className="border-t border-stone-800/80 mt-6 pt-5">
          <h3 className="text-xs uppercase tracking-wider text-rose-300/80 font-semibold mb-3 flex items-center gap-2">
            <span>Redemption Chronicles ({pass.redemptions?.length || 0})</span>
            <span className="h-1 w-1 rounded-full bg-rose-400 inline-block animate-pulse" />
          </h3>

          {!pass.redemptions || pass.redemptions.length === 0 ? (
            <p className="text-xs text-stone-600 italic">No redemptions logged yet. You hold complete ownership, my queen!</p>
          ) : (
            <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-2 scrollbar-thin">
              {pass.redemptions.map((log: RedemptionLog, idx: number) => (
                <div 
                  key={idx} 
                  className="bg-stone-900/50 border border-stone-800/30 rounded-xl p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
                >
                  <div>
                    <p className="text-xs text-stone-300 italic font-serif">
                      &ldquo;{log.note || "Redeemed with love"}&rdquo;
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-950/20 border border-rose-900/20 px-2 py-0.5 rounded-full">
                      {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
