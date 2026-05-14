import { TemplateDefinition, FontDefinition, IconDefinition } from "./types";

export const PRESET_TEMPLATES: TemplateDefinition[] = [
  {
    id: "luxury",
    name: "Luxury Black & Gold",
    description: "Premium cinematic aesthetic, rich dark background with shimmering gold gradients and traditional borders.",
    bgClass: "gold-shimmer-bg text-stone-200",
    textClass: "text-stone-300",
    borderClass: "luxury-border-gold",
    accentClass: "luxury-text-shimmer font-f-playfair",
    badgeClass: "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-stone-950 font-semibold",
    glassClass: "rgba(0, 0, 0, 0.65)"
  },
  {
    id: "pastel",
    name: "Sweet Romantic Pastel",
    description: "Soft pinks, warm cream background, sweet icons, round corners, and playful fonts.",
    bgClass: "bg-gradient-to-br from-rose-50 via-rose-100 to-amber-50 text-rose-950",
    textClass: "text-rose-800",
    borderClass: "border-2 border-dashed border-rose-300/60",
    accentClass: "text-rose-500 font-f-script",
    badgeClass: "bg-rose-500 text-white font-medium",
    glassClass: "rgba(255, 255, 255, 0.4)"
  },
  {
    id: "minimal",
    name: "Minimal Modern Crimson",
    description: "Clean layout, crisp sharp borders, bold sans-serif text, and deep premium crimson accents.",
    bgClass: "bg-zinc-950 text-zinc-150 border border-zinc-800",
    textClass: "text-zinc-400",
    borderClass: "border border-zinc-700",
    accentClass: "text-rose-500 font-f-grotesk",
    badgeClass: "bg-zinc-800 text-zinc-200 border border-zinc-700",
    glassClass: "rgba(10, 10, 10, 0.8)"
  },
  {
    id: "neon",
    name: "Retro Passion Neon",
    description: "Futuristic cyberpunk night vibes, vibrant deep purple base, and glowing neon-pink/magenta details.",
    bgClass: "bg-zinc-950 border border-fuchsia-500/25 shadow-[inset_0_1px_15px_rgba(217,70,239,0.15)]",
    textClass: "text-zinc-300",
    borderClass: "border border-fuchsia-500/40 shadow-[0_0_8px_rgba(236,72,153,0.3)]",
    accentClass: "text-fuchsia-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)] font-f-mono",
    badgeClass: "bg-fuchsia-500 text-black font-semibold",
    glassClass: "rgba(15, 10, 25, 0.75)"
  },
  {
    id: "celestial",
    name: "Celestial Stars Indigo",
    description: "Deep midnight skies, stellar navy blue gradients, and golden sparkling astronomical features.",
    bgClass: "bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 text-blue-100 border border-indigo-900/40",
    textClass: "text-indigo-200/90",
    borderClass: "border border-amber-300/40 shadow-[0_1px_10px_rgba(251,191,36,0.1)]",
    accentClass: "text-amber-300 font-f-cormorant italic font-medium",
    badgeClass: "bg-amber-400 text-stone-950 font-medium",
    glassClass: "rgba(8, 12, 32, 0.7)"
  }
];

export const PRESET_FONTS: FontDefinition[] = [
  { id: "playfair", name: "Playfair Display", family: "Playfair Display" },
  { id: "cormorant", name: "Cormorant Serif", family: "Cormorant Garamond" },
  { id: "script", name: "Romantic Cursive", family: "Great Vibes" },
  { id: "grotesk", name: "Space Grotesk", family: "Space Grotesk" },
  { id: "inter", name: "Inter Minimalist", family: "Inter" },
  { id: "mono", name: "JetBrains Technical", family: "JetBrains Mono" }
];

export const PRESET_ICONS: IconDefinition[] = [
  { id: "heart", name: "Heart", iconName: "Heart" },
  { id: "gift", name: "Surprise Gift", iconName: "Gift" },
  { id: "star", name: "Wish Fulfillment", iconName: "Star" },
  { id: "wine", name: "Date Night Dining", iconName: "Wine" },
  { id: "coffee", name: "Warm Cafe favors", iconName: "Coffee" },
  { id: "massage", name: "Soothing Massage", iconName: "Footprints" },
  { id: "ticket", name: "Movie / Admit One", iconName: "Ticket" },
  { id: "moon", name: "Cuddle & Sleepover", iconName: "Moon" },
  { id: "award", name: "Victory Reward", iconName: "Award" },
  { id: "sparkles", name: "Magical Favor / Help", iconName: "Sparkles" },
  { id: "flame", name: "Naughty Desire", iconName: "Flame" },
  { id: "crown", name: "Royal Treatment", iconName: "Crown" }
];

// Presets that can populate the form immediately for quick templates
export const LOVEPASS_PRESETS = [
  {
    title: "1-Hour Back Massage Vouch",
    subtitle: "Complete relaxation with optional warm essential oils",
    description: "1. Head, neck, shoulders, and full back massage\n2. Cozy romantic music and dim candlelight ambiance\n3. Redeemable immediately on demand",
    customQuote: "Your tension is my responsibility. Relax and let me take care of you.",
    validity: "Single Use Vow",
    totalRedemptionLimit: 1,
    iconId: "massage",
    templateId: "pastel",
    fontId: "script"
  },
  {
    title: "Candlelit Multi-Course Dinner",
    subtitle: "Chef's gourmet experience executed with passion",
    description: "1. Custom gourmet starter, main course, and dessert of choice\n2. Premium wine pairing + romantic tableside service\n3. Zero cleanup responsibilities to the receiver",
    customQuote: "A recipe has no soul. You, as the cook, must bring soul to the recipe.",
    validity: "Admit One",
    totalRedemptionLimit: 1,
    iconId: "wine",
    templateId: "luxury",
    fontId: "playfair"
  },
  {
    title: "Yes, You Are Right Token",
    subtitle: "Instantly end any healthy dispute with no questions asked",
    description: "1. Forgiving any slight miscommunication instantly\n2. Backed by solid laughter and a warm tight hug\n3. Can be activated at any time of day",
    customQuote: "Love is not about winning, but I am happy to let you claim this round.",
    validity: "3-Use Vault",
    totalRedemptionLimit: 3,
    iconId: "award",
    templateId: "minimal",
    fontId: "grotesk"
  },
  {
    title: "Starlight Adventure Request",
    subtitle: "A beautiful celestial midnight escape together",
    description: "1. Midnight picnic with hot cocoa and strawberries\n2. Laying under a cozy blanket, watching the constellation\n3. Soft slow-dance under the silver moonlight",
    customQuote: "Uncountable stars in the sky, and you are the brightest one in my universe.",
    validity: "Ultimate Pass",
    totalRedemptionLimit: 1,
    iconId: "star",
    templateId: "celestial",
    fontId: "cormorant"
  }
];
