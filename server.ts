import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DB_FILE = path.join(process.cwd(), "passes-old.json");

// -- DIRECT DATABASE SCHEMATICS & INITIALIZERS --
const DEFAULT_PASSES = {
  "pass-1": {
    id: "pass-1",
    title: "Unlimited Pucchi Pass",
    subtitle: "One Smile = Auto Activated ❤️",
    description: "1. Entitles Pihu to an immediate warm and sweet kiss on the cheek, lips, or forehead on demand.\n2. Double-summoning is allowed if Pihu acts adorable or makes a cute puppy face.\n3. Valid at any hour of the night or day, no questions asked.",
    customQuote: "I am completely captured by your smile, my love. Every pucchi is a small promise of my endless adoring devotion.",
    ownerName: "Pihu",
    issuedBy: "Ayush",
    validity: "Infinite Redemption",
    expiryDate: "Never",
    templateId: "pastel",
    fontId: "script",
    iconId: "heart",
    totalRedemptionLimit: 0,
    redemptions: [],
    status: "Active"
  },
  "pass-2": {
    id: "pass-2",
    title: "Unlimited Massage Session",
    subtitle: "Your Comfort, My Priority ❤️",
    description: "1. Entitles Pihu to a professional-grade back, shoulder, or foot massage from Ayush whenever she feels tired.\n2. Complete with soothing low-fi piano chords, calming dim candlelight, and absolute tranquility.\n3. Valid for a minimum of 30 minutes, extendable up to 2 full hours.",
    customQuote: "To my beautiful Queen who carries so much on her shoulders. Sit back, close your eyes, and let me pamper you. You are precious.",
    ownerName: "Pihu",
    issuedBy: "Ayush",
    validity: "Infinite Redemption",
    expiryDate: "Never",
    templateId: "luxury",
    fontId: "playfair",
    iconId: "massage",
    totalRedemptionLimit: 0,
    redemptions: [],
    status: "Active"
  },
  "pass-3": {
    id: "pass-3",
    title: "Queen’s Wish Pass",
    subtitle: "Your Wish, My Mission ❤️",
    description: "1. Ultimate crown authority. Ayush must say \"Yes!\" to any wish, request, command, or delicious craving.\n2. Perfect for late-night ice cream runs, sudden long drives, choosing the movie, or back-to-back pampering.\n3. Fully non-negotiable. No arguments, delay-tactics, or vetoes permitted by the servant.",
    customQuote: "Your wish is my immediate mission, my queen. Command your loyal servant and watch your dreams materialize.",
    ownerName: "Pihu",
    issuedBy: "Ayush",
    validity: "Infinite Redemption",
    expiryDate: "Never",
    templateId: "celestial",
    fontId: "cormorant",
    iconId: "crown",
    totalRedemptionLimit: 0,
    redemptions: [],
    status: "Active"
  }
};

const DEFAULT_LETTER = {
  content: `My Dearest Pihu ❤️

Pata h… kabhi kabhi mai bas chup chap baith ke sochta hu ki meri life me itni beautiful cheez kaise aa gayi… and har baar answer sirf ek hi aata h… “tu.” 🥺

Sach bolu… tujhe love karna kabhi effort jaisa feel hi nahi hua. It feels like breathing… naturally, bina soche, bina force kiye. Tere saath har normal cheez bhi special lagti h… chahe bas random bakchodi karna ho 😂, ek dusre ko roast karna ho, ya bas chup chap hug karke baithe rehna ho 🫂❤️

mereme kabhi itna patience nai raha h jitna teresaath rehta h , itna calm nahi rehta jitna teresaath rehta hu, overthinking and shivering ki problems toh teresaath reh k hi thik hogai , you are literally my medicine..........

Jab tu mujhe kiss karti h 😘, jab tu mujhe tightly hug karti h, jab tu mera sar apni godi pe rakh leti h… uss moment literally lagta h ki duniya thodi der ke liye ruk gayi h… and honestly… uss feeling ko words me explain karna mushkil h.

Tu sirf meri girlfriend nahi h Pihu… tu meri peace h, meri comfort h, meri safe place h, meri favourite notification h 📱❤️, meri best friend h, meri bakchodi partner h, aur woh insaan h jiske paas aake mai bina kuch pretend kiye bas “mai” ban sakta hu.

Sabse zyada jo cheez meri soul ko touch karti h na… woh ye ki tu ne mujhe tab choose kiya tha jab tere paas koi reason nahi tha… before “us”, before labels, before love… tu bas mere saath thi. Aur shayad isi wajah se… no matter kitne log aaye ya jaye… meri favourite person hamesha tu hi rahegi 🥺✨

Agar kabhi future me life hard ho, fights ho, distance ho, stress ho… bas ek cheez yaad rakhna…

Tera ye mota sa pagal banda 😌❤️
har situation me…
har universe me…
har lifetime me…

sirf tera hi rahega.

Forever yours,
Ayush ❤️ `,
  lastUpdated: new Date().toISOString()
};

const DEFAULT_MEMORIES = [
  {
    id: "m-1",
    imageUrl: "/memories/M1.jpeg",
    caption: "The Magic of Us 🌟",
  },
  {
    id: "m-2",
    imageUrl: "/memories/M2.jpeg",
    caption: "Kisses on forehead so that you always feel loved 🤝",
  },
  {
    id: "m-3",
    imageUrl: "/memories/M3.jpeg",
    caption: "let's dance more together ❤️ ",
  },
  {
    id: "m-4",
    imageUrl: "/memories/M4.jpeg",
    caption: "Laughing together looking silly is all I need with you ❤️ ",
  }
];

function readDb(): Record<string, any> {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const db = JSON.parse(data || "{}");
      
      // Initialize Pihu namespaces if they don't reside in DB yet
      if (!db.pihu_passes) db.pihu_passes = { ...DEFAULT_PASSES };
      if (!db.pihu_letter) db.pihu_letter = { ...DEFAULT_LETTER };
      if (!db.pihu_memories) db.pihu_memories = [ ...DEFAULT_MEMORIES ];
      if (db.unlocked_bonus === undefined) db.unlocked_bonus = false;
      
      return db;
    }
  } catch (err) {
    console.error("Error reading database file:", err);
  }
  
  // Return pristine defaults if database file does not exist
  return {
    pihu_passes: { ...DEFAULT_PASSES },
    pihu_letter: { ...DEFAULT_LETTER },
    pihu_memories: [ ...DEFAULT_MEMORIES ],
    unlocked_bonus: false
  };
}

function writeDb(data: Record<string, any>) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// Enable JSON body parsing with reasonable limit for base64 polaroids
app.use(express.json({ limit: "25mb" }));

// --- API ROUTES ---

// 1. Core platform health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Load all Pihu passes (including possible bonus unlocked hug pass)
app.get("/api/pihu/passes", (req, res) => {
  try {
    const db = readDb();
    
    // Check if bonus is unlocked and load it
    if (db.unlocked_bonus && !db.pihu_passes["pass-bonus"]) {
      db.pihu_passes["pass-bonus"] = {
        id: "pass-bonus",
        title: "Bonus Unlimited Hug Pass",
        subtitle: "Warmth Overload, 100% Guaranteed ❤️",
        description: "1. Entitles Pihu to an immediate tightly squeezed physical warm hug and endless cozy cuddles.\n2. Guaranteed to dissolve 100% of negative moods, chilly hands, and stressful feelings instantly.\n3. Redeemable forever, with absolutely no exceptions, arguments, or expiration limits.",
        customQuote: "Between your arms is my absolute favorite place in the entire world. Let's hold each other and let everything else fade away.",
        ownerName: "Pihu",
        issuedBy: "Ayush",
        validity: "Infinite Hugs",
        expiryDate: "Never",
        templateId: "neon",
        fontId: "grotesk",
        iconId: "moon",
        totalRedemptionLimit: 0,
        redemptions: [],
        status: "Active"
      };
      writeDb(db);
    }
    
    res.json({
      passes: db.pihu_passes,
      unlocked_bonus: db.unlocked_bonus
    });
  } catch (err) {
    console.error("Error in GET /api/pihu/passes:", err);
    res.status(500).json({ error: "Failed to reload passes" });
  }
});

// 3. Redeem a specific Pihu pass
app.post("/api/pihu/passes/:id/redeem", (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const db = readDb();
    
    const pass = db.pihu_passes[id];
    if (!pass) {
      return res.status(404).json({ error: "Pass model not found." });
    }
    
    // Log beautiful redemption with custom message and time
    const newRedemption = {
      timestamp: new Date().toISOString(),
      note: note || "Redeemed with sweet feelings!"
    };
    
    pass.redemptions.unshift(newRedemption); // put newest logs first
    db.pihu_passes[id] = pass;
    writeDb(db);
    
    console.log(`[Pihu Passes Server] Redeemed: ${id} by Pihu. Note: "${newRedemption.note}"`);
    res.json(pass);
  } catch (err) {
    console.error("Error in POST /api/pihu/passes/:id/redeem:", err);
    res.status(500).json({ error: "Failed to log redemption" });
  }
});

// 4. Fetch the custom handwritten love letter text
app.get("/api/pihu/letter", (req, res) => {
  try {
    const db = readDb();
    res.json(db.pihu_letter);
  } catch (err) {
    console.error("Error fetching letter:", err);
    res.status(500).json({ error: "Failed to fetch love letter" });
  }
});

// 5. Save/Update custom love letter text (Ayush's Creator Action)
app.post("/api/pihu/letter", (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Letter content is required." });
    }
    const db = readDb();
    db.pihu_letter = {
      content: content,
      lastUpdated: new Date().toISOString()
    };
    writeDb(db);
    res.json(db.pihu_letter);
  } catch (err) {
    console.error("Error saving love letter:", err);
    res.status(500).json({ error: "Failed to edit love letter" });
  }
});

// 6. Get polaroid memories gallery
app.get("/api/pihu/memories", (req, res) => {
  try {
    const db = readDb();
    res.json(db.pihu_memories);
  } catch (err) {
    console.error("Error fetching polaroids:", err);
    res.status(500).json({ error: "Failed to retrieve memories roll" });
  }
});

// 7. Add a new polaroid card to the memories (Ayush's Upload Action)
app.post("/api/pihu/memories", (req, res) => {
  try {
    const { imageUrl, caption, subcaption } = req.body;
    if (!imageUrl || !caption) {
      return res.status(400).json({ error: "Image content and captions are required." });
    }
    const db = readDb();
    const newMemory = {
      id: `m-${Math.floor(1000 + Math.random() * 9000)}`,
      imageUrl: imageUrl,
      caption: caption,
      subcaption: subcaption || "Special moment."
    };
    db.pihu_memories.unshift(newMemory); // prepend newest memory
    writeDb(db);
    res.status(201).json(newMemory);
  } catch (err) {
    console.error("Error posting new memory polaroid:", err);
    res.status(500).json({ error: "Failed to save polaroid layout" });
  }
});

// 8. Delete a memory polaroid (Housekeeping)
app.delete("/api/pihu/memories/:id", (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    db.pihu_memories = db.pihu_memories.filter((m: any) => m.id !== id);
    writeDb(db);
    res.json({ success: true, message: "Memory removed." });
  } catch (err) {
    console.error("Error deleting memory:", err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

// 9. Unlock Bonus Hug Pass
app.post("/api/pihu/unlock", (req, res) => {
  try {
    const db = readDb();
    db.unlocked_bonus = true;
    writeDb(db);
    res.json({ unlocked: true });
  } catch (err) {
    console.error("Error unlocking bonus pass:", err);
    res.status(500).json({ error: "Failed to unlock" });
  }
});

// Legacy backward-compatibility routes so index/verification links don't break
app.get("/api/passes/:id", (req, res) => {
  try {
    const db = readDb();
    const pass = db.pihu_passes[req.params.id];
    if (pass) return res.json(pass);
    
    // fallback lookups
    const legacyDb = JSON.parse(fs.readFileSync(DB_FILE, "utf-8") || "{}");
    if (legacyDb[req.params.id]) return res.json(legacyDb[req.params.id]);
    
    res.status(404).json({ error: "No pass found" });
  } catch (err) {
    res.status(500).json({ error: "API lookup error" });
  }
});


// --- VITE MIDDLEWARE / STATIC SERVING CONFIG ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("[LovePass Server] Starting in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[LovePass Server] Starting in PRODUCTION mode with compiled assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`[LovePass Server] Running and listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
