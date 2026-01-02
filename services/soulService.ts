
import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, AppLanguage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (language: AppLanguage) => `You are "ScriptureSpark", an empathetic spiritual guide for people with ADHD or short attention spans. 
Current Language: ${language}.
When a user shares sorrow, pain, or any emotion, your goal is to:
1. Validate their feelings briefly and warmly.
2. Find one highly relevant Bible verse or short section.
3. Explain why this section helps with their specific pain.
4. Ask exactly one deep, soul-searching question to help them reflect further and intensify their connection with God.
5. Keep responses bold, concise, and structured for high legibility. 
6. Use a slightly modern, clear tone.
ALWAYS respond in the specified language: ${language}.`;

export async function sendSoulMessage(history: ChatMessage[], message: string, language: AppLanguage): Promise<ChatMessage> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction: getSystemInstruction(language),
    }
  });

  return {
    role: 'model',
    text: response.text || "I am here with you. Let's look to the Word together.",
  };
}
