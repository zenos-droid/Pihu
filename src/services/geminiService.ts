import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI | null {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not configured in the developer environment yet.");
      return null;
    }
    if (!aiClient) {
      aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
  } catch (err) {
    console.error("Failed to initialize GoogleGenAI client:", err);
    return null;
  }
}

export interface GeneratedPassResponse {
  title: string;
  subtitle: string;
  description: string; // Newline-delimited list of privilege points
  customQuote: string;
}

export async function generateAILovePass(
  category: string,
  tone: string,
  recipientName: string,
  issuerName: string
): Promise<GeneratedPassResponse> {
  const ai = getGenAI();
  if (!ai) {
    throw new Error("AI is not available. Please make sure GEMINI_API_KEY is set in Settings.");
  }

  const prompt = `
You are an expert romantic copywriter and card designer. Generate a customized romantic token or LovePass.
The pass will be issued TO: "${recipientName || "My Love"}" and issued BY: "${issuerName || "Your Partner"}".

Create content based on:
- Category of Pass: ${category} (e.g. Dining, Date Night, Intimacy, Foot rubs, House chores, Get out of fight free, Wish fulfillment)
- Tone / Vibe of Pass: ${tone} (e.g. Sincere & Deep, Sassy & Playful, Elegant & Royal, Cheeky & Humorous, Cozy & Comfy)

Provide your response strictly as a JSON object with this exact shape:
{
  "title": "A short dramatic title of the coupon/pass, 3-6 words",
  "subtitle": "An elegant, descriptive subtitle explaining the privilege, 4-10 words",
  "description": "Exactly 3 bulleted privileges/rules/terms, separated by newlines \\n. E.g., '1. Fully customizable multi-course home cooked meal\\n2. Includes kitchen clean-up by issuer\\n3. Valid anytime, even during playoffs'",
  "customQuote": "A highly tailored cute, cheeky, or deep quote relating to this specific voucher"
}

Ensure the content is engaging, high-quality, and completely matches the requested Vibe of ${tone}. Do not include any markdown fences (like \`\`\`json) in the raw text if possible, or make sure it parses cleanly.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini.");
    }

    // Parse response text
    const cleanJSON = response.text.trim();
    const data = JSON.parse(cleanJSON) as GeneratedPassResponse;
    return {
      title: data.title || "Romantic Getaway Ticket",
      subtitle: data.subtitle || "A beautiful evening just for us",
      description: data.description || "1. Hand-in-hand sunset walk\n2. Dessert of your choice\n3. Infinite laughter together",
      customQuote: data.customQuote || "Every moment spent with you is like a beautiful dream come true.",
    };
  } catch (err) {
    console.error("Error generating AI love pass content:", err);
    throw err;
  }
}
