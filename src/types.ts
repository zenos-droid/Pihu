export interface Redemption {
  timestamp: string;
  note?: string;
}

export interface LovePass {
  id?: string;
  title: string;
  subtitle: string;
  description: string; // List of privileges (can be entered raw or newline-split)
  ownerName: string; // Issued To
  issuedBy: string;  // Issued By
  validity: string;  // e.g., "Single Use", "Unlimited", "3 Times"
  expiryDate: string; // YYYY-MM-DD format or "Never"
  customQuote: string; // Custom quote at the bottom/back of the pass
  templateId: string; // luxury, pastel, minimal, neon, celestial
  fontId: string;     // playfair, inter, space, jetbrains, cormorant, greatvibes
  iconId: string;     // heart, gift, star, wine, etc.
  bgColor: string;    // Custom flat color or gradient selection override
  logoUrl?: string;   // Image base64 string
  totalRedemptionLimit: number; // 0 for unlimited, or numerical limit
  redemptions: Redemption[];
  status: "Active" | "Redeemed" | "Expired";
  createdAt?: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  accentClass: string;
  badgeClass: string;
  glassClass: string;
}

export interface FontDefinition {
  id: string;
  name: string;
  family: string;
  importUrl?: string;
}

export interface IconDefinition {
  id: string;
  name: string;
  iconName: string; // Map to Lucide icon name
}
