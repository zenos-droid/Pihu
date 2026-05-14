import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { 
  Heart, Star, Award, Sparkles, Flame, Moon, Crown, Coffee, 
  Clock, Compass, Volume2, VolumeX, Eye, Share2, Copy, Trash2, 
  Edit, Upload, Lock, Unlock, ChevronLeft, ChevronRight, Check, 
  Plus, RefreshCw, X, Play, Pause, BookOpen, MapPin, EyeOff, Key
} from "lucide-react";

import { RomanticPianoSynth } from "./services/audioService";
import { 
  REASONS_I_LOVE_YOU, 
  TIMELINE_EVENTS, 
  FUTURE_DREAMS, 
  HEART_WHISPERS,
  LoveReason,
  TimelineEvent,
  FutureDream
} from "./services/romanticPreservers";

import SurpriseModal from "./components/SurpriseModal";
import PolaroidGallery from "./components/PolaroidGallery";

// Let's instantiate our Procedural Romantic Piano Audio Synth globally so it survives re-renders
const synthEngine = new RomanticPianoSynth();

export default function App() {
  // App view modes
  const [showLanding, setShowLanding] = useState(true);
  const [selectedSection, setSelectedSection] = useState<"passes" | "memories" | "reasons" | "timeline" | "letter" | "future">("passes");
  
  // Audio state
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  // Creator tools & state
  const [isCreatorMode, setIsCreatorMode] = useState(false);
  const [showPinOverlay, setShowPinOverlay] = useState(false);
  const [pinInput, setPinInput] = useState("");

  // Sync data lists from Backend
  const [passes, setPasses] = useState<Record<string, any>>({});
  const [memories, setMemories] = useState<any[]>([]);
  const [loveLetter, setLoveLetter] = useState<{ content: string; lastUpdated: string }>({ content: "", lastUpdated: "" });
  const [unlockedBonus, setUnlockedBonus] = useState(false);
  const [loading, setLoading] = useState(false);

  // Focus modal & cards state
  const [selectedPass, setSelectedPass] = useState<any | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [tilt, setTilt] = useState<{ x: number; y: number; activeId: string | null }>({ x: 0, y: 0, activeId: null });
  
  // Letter animation state
  const [letterOpen, setLetterOpen] = useState(false);
  const [letterEditText, setLetterEditText] = useState("");
  const [savingLetter, setSavingLetter] = useState(false);

  // Interactive secret corner whispers
  const [activeWhisper, setActiveWhisper] = useState("");
  const [whisperTime, setWhisperTime] = useState<any>(null);

  // Konami code matching state
  const [keyHistory, setKeyHistory] = useState<string[]>([]);

  // 1. Fetch initial data from server on load
  const loadContent = async () => {
    setLoading(true);
    try {
      // Passes
      const passRes = await fetch("/api/pihu/passes");
      if (passRes.ok) {
        const passData = await passRes.json();
        setPasses(passData.passes);
        setUnlockedBonus(passData.unlocked_bonus);
      }
      
      // Memories
      const memRes = await fetch("/api/pihu/memories");
      if (memRes.ok) {
        const memData = await memRes.json();
        setMemories(memData);
      }

      // Letter
      const letRes = await fetch("/api/pihu/letter");
      if (letRes.ok) {
        const letData = await letRes.json();
        setLoveLetter(letData);
        setLetterEditText(letData.content);
      }
    } catch (err) {
      console.error("Failed to load synced server data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  // 2. Play beautiful chime bell
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  // 3. Audio toggle handler
  const handleMusicToggle = () => {
    const nextPlay = synthEngine.toggle();
    setIsMusicPlaying(nextPlay);
    playChime();
  };

  // 4. Open website from landing
  const handleOpenSurprise = () => {
    // Attempt music autoplay on click interaction
    try {
      synthEngine.start();
      setIsMusicPlaying(true);
    } catch (e) {}
    
    playChime();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.7 }
    });
    
    // Smooth transition
    setShowLanding(false);
  };

  // 5. Card interactive mouse rotations
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateY = ((x - midX) / midX) * 10; // Up to 10 degrees tilt
    const rotateX = -((y - midY) / midY) * 10;
    setTilt({ x: rotateX, y: rotateY, activeId: cardId });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, activeId: null });
  };

  const handleCardClick = (cardId: string, e: React.MouseEvent) => {
    // Flip targeted card
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
    playChime();
  };

  // 6. Redeem activation API handler
  const handleRedeemPass = async (whisperText: string) => {
    if (!selectedPass) return;
    try {
      const res = await fetch(`/api/pihu/passes/${selectedPass.id}/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: whisperText || "Redeemed with sweet feelings" })
      });
      if (res.ok) {
        const updatedPass = await res.json();
        
        // Update local state list
        setPasses(prev => ({
          ...prev,
          [selectedPass.id]: updatedPass
        }));
        setSelectedPass(updatedPass);

        // Sweet triggers
        playChime();
        confetti({
          particleCount: 160,
          spread: 80,
          origin: { y: 0.6 }
        });

        // Trigger floating overlay notification
        triggerWhisper("👑 Ayush has officially been summoned! He is on his way to you! ❤️");
      } else {
        const err = await res.json();
        throw new Error(err.error || "Could not log redemption.");
      }
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  };

  // 7. Change/seal custom love letter
  const handleSaveLetter = async () => {
    setSavingLetter(true);
    try {
      const res = await fetch("/api/pihu/letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: letterEditText })
      });
      if (res.ok) {
        const updatedLetter = await res.json();
        setLoveLetter(updatedLetter);
        triggerWhisper("✉️ Letter sealed & successfully synced on cloud vault!");
        playChime();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingLetter(false);
    }
  };

  // 8. Custom memories callbacks
  const handleAddMemory = async (imageUrl: string, caption: string, subcaption: string) => {
    const res = await fetch("/api/pihu/memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl, caption, subcaption })
    });
    if (res.ok) {
      const newMem = await res.json();
      setMemories(prev => [newMem, ...prev]);
      triggerWhisper("📸 Added beautiful Polaroid memory to ledger!");
      playChime();
    } else {
      const err = await res.json();
      throw new Error(err.error || "Failed to post polaroid.");
    }
  };

  const handleDeleteMemory = async (id: string) => {
    const res = await fetch(`/api/pihu/memories/${id}`, {
      method: "DELETE"
    });
    if (res.ok) {
      setMemories(prev => prev.filter(m => m.id !== id));
      triggerWhisper("🔥 Burned polaroid memory!");
      playChime();
    }
  };

  // 9. Easter Eggs: Corner Whispers
  const triggerWhisper = (msg: string) => {
    setActiveWhisper(msg);
    if (whisperTime) clearTimeout(whisperTime);
    const t = setTimeout(() => {
      setActiveWhisper("");
    }, 4500);
    setWhisperTime(t);
  };

  const handleCornerWhisperClick = () => {
    const randomMsg = HEART_WHISPERS[Math.floor(Math.random() * HEART_WHISPERS.length)];
    triggerWhisper(randomMsg);
    playChime();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { x: 0.8, y: 0.8 }
    });
  };

  // 10. Creator Mode Toggle via passcode
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = pinInput.trim().toLowerCase();
    
    // Sweet bypass keywords for Ayush
    if (cleaned === "ikko" || cleaned === "pihu" || cleaned === "guriya" || cleaned === "2024") {
      setIsCreatorMode(true);
      setShowPinOverlay(false);
      setPinInput("");
      triggerWhisper("⚙️ Creator Mode unlocked! You can now upload Polaroids & update written files.");
      playChime();
    } else {
      triggerWhisper("⚠️ Password mismatch! Try entering sweet names...");
      setPinInput("");
    }
  };

  // 11. Konami / Secret Name clicks code to unlock Bonus Hug Pass
  const handleUnlockBonusDirectly = async () => {
    try {
      const res = await fetch("/api/pihu/unlock", { method: "POST" });
      if (res.ok) {
        setUnlockedBonus(true);
        // Reload passes
        const passRes = await fetch("/api/pihu/passes");
        if (passRes.ok) {
          const passData = await passRes.json();
          setPasses(passData.passes);
        }
        playChime();
        confetti({
          particleCount: 150,
          spread: 90,
          colors: ["#ec4899", "#f472b6", "#a1a1aa", "#dfb15b"]
        });
        triggerWhisper("🧸 Anomaly Detected! Magical 'Bonus Unlimited Hug Pass' unlocked inside passes room!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Listen to keyboard clicks for Konami cheat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = [...keyHistory, e.key];
      if (keys.length > 10) keys.shift();
      setKeyHistory(keys);

      const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
      if (keys.join(",").includes(konami.join(","))) {
        handleUnlockBonusDirectly();
        setKeyHistory([]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyHistory]);

  return (
    <div className="min-h-screen text-stone-100 flex flex-col relative select-none overflow-x-hidden bg-gradient-to-b from-[#1c070a] via-[#100305] to-[#120406]">
      
      {/* Absolute floating warm glowing radial background meshes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-rose-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-900/10 blur-[140px] pointer-events-none" />

      {/* Floating Sparkles & Petas in CSS Styling block */}
      <style>{`
        @keyframes floatSlowDown {
          0% { transform: translateY(-5%) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(105%) rotate(360deg); opacity: 0; }
        }
        .falling-leaf {
          position: absolute;
          top: -20px;
          pointer-events: none;
          z-index: 1;
        }
        .gold-shimmer-bg {
          background: linear-gradient(135deg, #1c1917 0%, #292524 100%);
          position: relative;
        }
        .gold-shimmer-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(135deg, #dfb15b 0%, #584c30 40%, #dfb15b 100%);
          animation: borderGlow 6s linear infinite alternate;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        @keyframes borderGlow {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* Floating decorative petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="falling-leaf text-rose-500/35 text-lg select-none"
            style={{
              left: `${Math.random() * 95}%`,
              animationName: "floatSlowDown",
              animationDuration: `${12 + Math.random() * 15}s`,
              animationDelay: `${Math.random() * 10}s`,
              animationIterationCount: "infinite",
              transform: `scale(${0.5 + Math.random()})`
            }}
          >
            🌸
          </div>
        ))}
      </div>

      {/* FLOATING OVERLAY WHISPER NOTIFICATION */}
      {activeWhisper && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-950/90 hover:bg-stone-900 border border-rose-900/60 p-4 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md max-w-[90vw] md:max-w-md animate-bounce">
          <div className="p-2 rounded-full bg-rose-950/60 text-rose-400">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <p className="text-stone-200 text-xs leading-relaxed font-serif">
            {activeWhisper}
          </p>
          <button onClick={() => setActiveWhisper("")} className="text-stone-500 hover:text-stone-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ROMANTIC BACKGROUND AMBIENT CONTROLLER (ALWAYS FLOATING IN TOP-RIGHT) */}
      <div className="fixed top-5 right-5 z-40 flex items-center gap-2">
        <button
          onClick={handleMusicToggle}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase border rounded-full transition-all duration-300 ${
            isMusicPlaying 
              ? "bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-950/60" 
              : "bg-stone-900/60 border-stone-800 text-stone-500 hover:text-stone-300"
          }`}
        >
          {isMusicPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{isMusicPlaying ? "Love Synth: ON" : "Love Synth: OFF"}</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/*                    1. SURPRISE LANDING PAGE               */}
      {/* ========================================================= */}
      {showLanding ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 relative">
          <div className="max-w-2xl space-y-8 animate-fade-in">
            
            {/* Spinning Golden Logo Heart Rings */}
            <div className="relative inline-block scale-110 mb-4 cursor-pointer" onClick={handleCornerWhisperClick}>
              <div className="absolute inset-0 rounded-full bg-rose-500/10 blur-xl animate-pulse" />
              <div className="border border-dashed border-rose-400/40 rounded-full p-6 animate-spin-slow">
                <div className="border border-amber-300/30 p-4 rounded-full">
                  <div className="bg-rose-950/40 p-4 rounded-full border border-rose-900/40">
                    <Heart className="w-12 h-12 text-rose-400 fill-rose-500/30 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Typewriter message */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-amber-200 to-rose-200 py-2">
                Hey Pihu…
              </h2>
              <p className="text-lg md:text-2xl font-serif text-rose-300/90 italic tracking-wide max-w-lg mx-auto">
                &ldquo;I made something beautiful, exclusively for you.&rdquo; ❤️
              </p>
            </div>

            {/* Large Glowing Button */}
            <div className="pt-4 flex flex-col items-center">
              <button
                onClick={handleOpenSurprise}
                className="group relative px-8 py-4 rounded-2xl border border-rose-800/60 font-semibold text-xs tracking-widest uppercase text-[#1c070a] bg-gradient-to-r from-rose-300 via-amber-200 to-rose-300 hover:shadow-[0_0_35px_rgba(244,197,204,0.45)] transition-all duration-500 transform hover:-translate-y-1 active:translate-y-0 active:scale-95"
              >
                Open Your Surprise 🌸
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* ========================================================= */
        /*                    2. DASHBOARD SUITE                      */
        /* ========================================================= */
        <div className="flex-1 flex flex-col z-10 w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
          
          {/* HEADER SUITE BLOCK */}
          <header className="flex flex-col md:flex-row justify-between items-center border-b border-stone-900 pb-6 mb-8 gap-4 select-none">
            
            {/* Logo Titles */}
            <div className="text-center md:text-left flex items-center gap-3">
              <div 
                onClick={handleCornerWhisperClick}
                className="p-3 rounded-2xl bg-stone-950/60 border border-stone-800 text-rose-400 shadow-xl cursor-all-scroll animate-pulse"
              >
                <Heart className="w-5 h-5 fill-rose-500/20" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-bold text-stone-100 flex items-center gap-2 justify-center md:justify-start">
                  <span>Pihu’s Exclusive Passes</span>
                </h1>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-2 items-center flex-wrap justify-center">
              <button
                onClick={() => setSelectedSection("passes")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  selectedSection === "passes" ? "bg-rose-950/40 text-rose-300 border border-rose-800" : "text-stone-400 hover:text-stone-200 border border-transparent"
                }`}
              >
                🎟️ Passes Room
              </button>

              <button
                onClick={() => setSelectedSection("memories")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  selectedSection === "memories" ? "bg-rose-950/40 text-rose-300 border border-rose-800" : "text-stone-400 hover:text-stone-200 border border-transparent"
                }`}
              >
                📸 Our Memories
              </button>

              <button
                onClick={() => setSelectedSection("reasons")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  selectedSection === "reasons" ? "bg-rose-950/40 text-rose-300 border border-rose-800" : "text-stone-400 hover:text-stone-200 border border-transparent"
                }`}
              >
                ✨ Why I Love You
              </button>

              <button
                onClick={() => setSelectedSection("letter")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  selectedSection === "letter" ? "bg-rose-950/40 text-rose-300 border border-rose-800" : "text-stone-400 hover:text-stone-200 border border-transparent"
                }`}
              >
                ✉️ Secret Wax Letter
              </button>
            </div>

          </header>

          {/* ======================= NAV SECTION CHANNELS ======================= */}
          
          {/* ROOM 1: PASSES HUBS */}
          {selectedSection === "passes" && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl font-serif text-stone-100">Your Exclusive Royal Passwords</h2>
                <p className="text-xs text-stone-400">
                  Click on the cards to flip them and view details.
                </p>
              </div>

              {/* Passes Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center py-4">
                {Object.values(passes).map((pass: any) => {
                  const isFlipped = flippedCards[pass.id] || false;
                  
                  // Compute custom tilt styles per card on hover
                  const isHovered = tilt.activeId === pass.id;
                  const cardTransform = isHovered 
                    ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.025)`
                    : `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;

                  // Pick visual design classes
                  let bgTheme = "bg-gradient-to-b from-[#310c11] to-[#1c0305] border border-rose-900/30";
                  let decorativeOverlay = "bg-gradient-to-tr from-rose-500/5 to-white/[0.04]";
                  let iconColor = "text-rose-400";
                  let serialBorder = "border-rose-950/40";

                  if (pass.templateId === "luxury") {
                    bgTheme = "gold-shimmer-bg text-stone-100";
                    decorativeOverlay = "bg-gradient-to-tr from-amber-500/5 to-white/[0.02]";
                    iconColor = "text-amber-300";
                    serialBorder = "border-amber-900/30";
                  } else if (pass.templateId === "celestial") {
                    bgTheme = "bg-gradient-to-b from-[#0e172a] via-[#090d16] to-[#04060b] border border-blue-900/20";
                    decorativeOverlay = "bg-gradient-to-tr from-amber-400/5 to-white/[0.02]";
                    iconColor = "text-amber-200";
                    serialBorder = "border-amber-900/10";
                  } else if (pass.templateId === "neon") {
                    bgTheme = "bg-gradient-to-b from-[#1b0922] via-[#0d0411] to-[#050107] border border-fuchsia-900/50 shadow-[0_0_20px_rgba(235,76,242,0.1)]";
                    decorativeOverlay = "bg-gradient-to-tr from-fuchsia-500/5 to-white/[0.04]";
                    iconColor = "text-fuchsia-400";
                    serialBorder = "border-fuchsia-950/30";
                  }

                  // Pick raw icons
                  const getLucideIcon = (id: string) => {
                    switch (id) {
                      case "massage": return <Award className="w-11 h-11" />;
                      case "crown": return <Crown className="w-11 h-11" />;
                      case "moon": return <Moon className="w-11 h-11 animate-pulse" />;
                      default: return <Heart className="w-11 h-11 fill-current" />;
                    }
                  };

                  return (
                    <div 
                      key={pass.id} 
                      className="flex flex-col items-center gap-4 group"
                    >
                      {/* Interactive physical 3D container viewport */}
                      <div
                        onMouseMove={(e) => handleMouseMove(e, pass.id)}
                        onMouseLeave={handleMouseLeave}
                        onClick={(e) => handleCardClick(pass.id, e)}
                        style={{ transform: cardTransform, transition: isHovered ? "none" : "transform 0.4s ease" }}
                        className="relative w-full max-w-[340px] aspect-[1.58/1] cursor-pointer group rounded-2xl shadow-2xl overflow-hidden select-none"
                      >
                        {/* 3D rotation flip panel */}
                        <div 
                          className="w-full h-full duration-700 select-none relative"
                          style={{
                            transformStyle: "preserve-3d",
                            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                          }}
                        >
                          {/* FRONT SIDE */}
                          <div 
                            className={`absolute inset-0 w-full h-full p-5 rounded-2xl flex flex-col justify-between ${bgTheme}`}
                            style={{ backfaceVisibility: "hidden" }}
                          >
                            <div className="absolute inset-0 rounded-2xl pointer-events-none" />
                            {decorativeOverlay && <div className={`absolute inset-0 ${decorativeOverlay} pointer-events-none rounded-2xl`} />}
                            
                            {/* Front Header */}
                            <div className="flex justify-between items-center z-10">
                              <span className="text-[8px] uppercase tracking-widest font-mono text-stone-500">
                                👑 Pihu Exclusive Vow
                              </span>
                              <div className="text-[9px] font-mono opacity-50 tracking-wider">
                                {pass.id.toUpperCase()}
                              </div>
                            </div>

                            {/* Center Logo */}
                            <div className="flex flex-col items-center justify-center text-center my-auto z-10">
                              <div className={`mb-2 drop-shadow-md transition-transform duration-300 group-hover:scale-110 ${iconColor}`}>
                                {getLucideIcon(pass.iconId)}
                              </div>
                              <h3 className="text-lg md:text-xl font-serif text-stone-100 font-bold tracking-normal leading-tight">
                                {pass.title}
                              </h3>
                              <p className="text-[10px] font-serif text-rose-300/80 italic mt-0.5 max-w-[270px]">
                                {pass.subtitle}
                              </p>
                            </div>

                            {/* Front footer credit logs */}
                            <div className="flex justify-between items-end border-t border-stone-800/60 pt-2 text-[9px] z-10 text-stone-400">
                              <div>
                                <span className="text-[7px] uppercase tracking-wider block opacity-40">Recipient</span>
                                <span className="font-semibold block">{pass.ownerName}</span>
                              </div>
                              <div>
                                <span className="text-[7px] uppercase tracking-wider block opacity-40">Issuer</span>
                                <span className="font-semibold block">{pass.issuedBy}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[7px] uppercase tracking-wider block opacity-40">Frequency</span>
                                <span className="font-bold block text-rose-400">{pass.validity}</span>
                              </div>
                            </div>
                          </div>

                          {/* BACK SIDE */}
                          <div 
                            className={`absolute inset-0 w-full h-full p-5 rounded-2xl flex flex-col justify-between ${bgTheme}`}
                            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                          >
                            <div className="absolute inset-0 rounded-2xl pointer-events-none" />
                            
                            {/* Terms outline */}
                            <div className="z-10 space-y-1.5 max-h-[60%] overflow-hidden">
                              <span className="text-[8px] uppercase tracking-widest text-[#dfb15b] block font-mono">
                                Vow Terms & Privileges
                              </span>
                              <ul className="space-y-1 text-left">
                                {pass.description.split("\n").slice(0, 2).map((item: string, idx: number) => (
                                  <li key={idx} className="text-[10px] leading-snug flex items-start gap-1 text-stone-300">
                                    <span className="text-rose-400 shrink-0">❤</span>
                                    <span className="line-clamp-2">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Little cursive summary quote */}
                            <div className="z-10 text-center my-0.5 border-t border-b border-stone-800/60 py-1 max-h-[38px] overflow-hidden">
                              <p className="font-serif italic text-xs text-rose-200/90 leading-tight truncate">
                                &ldquo;{pass.customQuote}&rdquo;
                              </p>
                            </div>

                            {/* Status bar */}
                            <div className="flex justify-between items-center z-10 text-[9px]">
                              <div>
                                <span className="text-[7px] font-mono text-stone-500 uppercase block">Total Uses</span>
                                <span className="font-mono font-bold text-stone-300 bg-stone-900 border border-stone-800/40 px-1.5 py-0.5 rounded">
                                  {pass.redemptions?.length || 0} Activations
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] font-mono tracking-widest text-emerald-400 uppercase font-semibold">Active Vault</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Secret bonus card locked room section if not unlocked yet */}
              {!unlockedBonus && (
                <div className="text-center py-6 border-t border-stone-900/60 mt-12 max-w-sm mx-auto">
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    🌟 Locked Chamber: There is a secret bonus unlimited card tucked here. Connect with your keyboard passcode or click beneath.
                  </p>
                  <button
                    onClick={handleUnlockBonusDirectly}
                    className="mt-2 text-[9px] uppercase tracking-wider text-amber-200/60 hover:text-amber-200 hover:underline font-mono"
                  >
                    Unlocks Magical Hug Card (Bypass)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ROOM 2: MEMORIES ROOM */}
          {selectedSection === "memories" && (
            <div className="space-y-6 animate-fade-in text-center max-w-3xl mx-auto">
              <div>
                <h2 className="text-2xl font-serif text-stone-100 mt-1">Our Cozy Polaroid Chronicles</h2>
              </div>

              {/* Polaroid slideshow deck subcomponent */}
              <PolaroidGallery
                memories={memories}
                onAddMemory={handleAddMemory}
                onDeleteMemory={handleDeleteMemory}
                isCreatorMode={isCreatorMode}
              />
            </div>
          )}

          {/* ROOM 3: REASONS EYE REVEAL */}
          {selectedSection === "reasons" && (
            <div className="space-y-8 animate-fade-in text-center">
              <div>
                <h2 className="text-2xl font-serif text-stone-100 mt-1">Reasons why you are my favourite</h2>
              </div>

              {/* Emblems grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto py-2">
                {REASONS_I_LOVE_YOU.map((reason: LoveReason) => {
                  return (
                    <div
                      key={reason.id}
                      className="group relative rounded-2xl border border-stone-800 bg-stone-950/80 p-8 flex flex-col items-center justify-between min-h-[420px] transition-all duration-300 hover:border-rose-900/40 hover:shadow-[0_10px_20px_rgba(183,110,121,0.06)] hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Decorative internal card seal shape */}
                      <div className="absolute top-2 right-2 flex items-center justify-center p-1 rounded-full bg-rose-950/20 text-rose-400">
                        <Star className="w-3 h-3 fill-rose-500/10 animate-spin-slow" />
                      </div>

                      {/* Shimmer line inside seal */}
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#dfb15b] via-stone-800 to-transparent" />

                      <div className="mt-2 space-y-1 text-center">
                        <span className="text-sm uppercase text-rose-300/70 border border-rose-900/40 px-4 py-2 rounded-full font-mono">
                          {reason.badge}
                        </span>
                        <h3 className="text-2xl text-stone-200 mt-3 font-serif font-bold">
                          {reason.id}. {reason.title}
                        </h3>
                      </div>

                      {/* Secret reveals section */}
                      <div className="mt-4 relative w-full h-[96px]">
                        {/* COVER SEAL */}
                        <div className="absolute inset-0 bg-stone-900 border border-stone-800 rounded-xl p-3 flex flex-col items-center justify-center transition-all duration-500 group-hover:-translate-y-20 group-hover:opacity-0 pointer-events-none">
                          <Heart className="w-6 h-6 text-rose-400 animate-pulse mb-1 group-hover:scale-125 transition-transform" />
                          <span className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">
                            Reveal Story
                          </span>
                        </div>

                        {/* REVEALED CONTENT */}
                        <div className="absolute inset-0 text-left flex items-start justify-center p-1 text-stone-300 text-xs italic font-serif leading-relaxed">
                          &ldquo;{reason.description}&rdquo;
                        </div>
                      </div>

                      <div className="w-full text-center border-t border-stone-900 mt-4 pt-2">
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* ROOM 4: SECRET LETTER WAX SEAL */}
          {selectedSection === "letter" && (
            <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
              
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-serif text-stone-100">Ayush's Secret Love Letter</h2>
              </div>

              {/* Physical Sealed Envelope Frame */}
              <div className="relative w-full overflow-hidden min-h-[400px] border border-stone-900 bg-stone-950 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center shadow-2xl">
                
                {/* Envelope lining details overlay */}
                <div className="absolute inset-3 border border-stone-800 rounded-2xl pointer-events-none" />

                {!letterOpen ? (
                  /* ENVELOPE FRONT COVER: CLOSED */
                  <div className="text-center flex flex-col items-center space-y-6 z-10 py-12">
                    {/* Pulsing seal */}
                    <div 
                      onClick={() => { playChime(); setLetterOpen(true); }}
                      className="relative h-20 w-20 rounded-full bg-rose-950/40 border border-[#dfb15b] flex items-center justify-center text-[#dfb15b] shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce"
                    >
                      <Heart className="w-10 h-10 text-rose-400 fill-rose-500/20" />
                      <div className="absolute inset-0 rounded-full border border-dashed border-[#dfb15b]/40 animate-spin-slow" />
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-md font-serif text-stone-200">Pouring Heart from Ayush</h3>
                      <p className="text-[10px] text-[#dfb15b] tracking-widest uppercase font-mono">
                        🔒 Click Wax Seal to Open Vow Scroll
                      </p>
                    </div>
                  </div>
                ) : (
                  /* ENVELOPE INSIDE PAPER SCROLL: UNLOCKED */
                  <div className="w-full z-10 space-y-6 animate-fade-in">
                    
                    {/* Envelope top bar */}
                    <div className="flex justify-between items-center border-b border-stone-900 pb-3">
                      <span className="text-[9px] uppercase tracking-wider text-rose-300 font-mono">Love Scroll Sealed on cloud</span>
                      <button 
                        onClick={() => { playChime(); setLetterOpen(false); }}
                        className="text-[10px] text-stone-500 hover:text-stone-300 underline font-mono"
                      >
                        [ Re-Seal Envelope ]
                      </button>
                    </div>

                    {/* Paper Parchment Body text */}
                    <div className="bg-[#FAF6F0] rounded-2xl p-6 md:p-8 text-stone-950 shadow-inner border border-stone-200 max-h-[350px] overflow-y-auto pr-3">
                      <p className="font-serif italic text-base whitespace-pre-line leading-relaxed tracking-wide font-medium pr-1 select-text selection:bg-rose-200">
                        {loveLetter.content || "Loading your handwritten devotions..."}
                      </p>
                    </div>

                    <div className="text-center pt-2">
                      <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block">
                        Last written update: {new Date(loveLetter.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Letter customization only for Ayush's Creator Action */}
                    {isCreatorMode && (
                      <div className="border-t border-stone-850 pt-5 mt-6 space-y-3 text-left">
                        <label className="block text-xs text-rose-300 font-serif">
                          ✍️ Ayush's Pencil Scroll Edit (Creator Mode Panel)
                        </label>
                        <textarea
                          rows={6}
                          value={letterEditText}
                          onChange={(e) => setLetterEditText(e.target.value)}
                          className="w-full text-xs text-stone-200 bg-stone-900 border border-stone-800 rounded-xl p-3 focus:outline-none focus:border-rose-900"
                          placeholder="Write your sweet love letter here..."
                        />
                        <button
                          onClick={handleSaveLetter}
                          disabled={savingLetter}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gradient-to-r from-rose-300 to-amber-200 text-stone-950 disabled:opacity-50"
                        >
                          {savingLetter ? "Sealing Vows..." : "Seal & Update Scroll Text ✨"}
                        </button>
                      </div>
                    )}

                  </div>
                )}

              </div>
            </div>
          )}
            

          {/* SHARED SUITE FOOTER DETAILS */}
          <footer className="border-t border-stone-900 pt-6 mt-12 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-stone-500 font-mono select-none">
            
            {/* Copyright notes */}
            <div>
              Made with pure adoring love past the edge of stars by <span className="text-rose-400 font-semibold cursor-pointer" onClick={() => triggerWhisper("❤️ Ayush is entirely yours, Pihu.")}>Ayush</span> for Pihu.
            </div>

            {/* Locked tool triggers */}
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setShowPinOverlay(!showPinOverlay)}
                className="flex items-center gap-1.5 hover:text-stone-300 transition-colors cursor-pointer"
              >
                {isCreatorMode ? <Unlock className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isCreatorMode ? "Creative Tools: Unlocked" : "Ayush Tools"}</span>
              </button>

              <button 
                onClick={handleCornerWhisperClick}
                className="flex items-center gap-1 hover:text-stone-300 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#dfb15b]" />
                <span>Tap for Sparkle</span>
              </button>
            </div>

          </footer>

        </div>
      )}

      {/* ======================= POPUP OVERLAY MODALS ======================= */}

      {/* 1. SECURE PASS ACTIVATION LETTERS MODAL */}
      <SurpriseModal
        pass={selectedPass}
        isOpen={selectedPass !== null}
        onClose={() => setSelectedPass(null)}
        isRedeeming={loading}
        onRedeem={handleRedeemPass}
      />

      {/* 2. CREATIVE TOOLS PASSCODE PIN PROMPT OVERLAY */}
      {showPinOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-stone-950/70">
          <div className="w-full max-w-sm rounded-2xl border border-stone-850 bg-stone-950 p-6 shadow-2xl relative text-stone-200 text-center">
            
            {/* Close button */}
            <button
              onClick={() => setShowPinOverlay(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-stone-500 hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>

            <Key className="w-8 h-8 text-rose-400 mx-auto animate-bounce mb-3" />
            
            <h3 className="text-base text-stone-100 font-serif">Unlock Creative Authority</h3>
            <p className="text-[11px] text-stone-500 mt-1 max-w-[260px] mx-auto">
              Welcome Ayush. Input your custom sweet token pet-name to access custom letter & memory polaroid post files.
            </p>

            <form onSubmit={handlePinSubmit} className="mt-4 space-y-3">
              <input
                type="password"
                placeholder="Hint: Your name, sweet names..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center text-xs rounded-xl bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-rose-900 py-3"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs uppercase bg-rose-300 text-stone-950 hover:bg-rose-400 cursor-pointer"
              >
                Access Creative Tools ✨
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
