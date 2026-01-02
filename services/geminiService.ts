
import { GoogleGenAI, Type } from "@google/genai";
import { ChapterSummary, BibleVerse, AppLanguage, TranslationStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getChapterSummary(book: string, chapter: number, language: AppLanguage = 'en'): Promise<ChapterSummary> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide a very short, engaging summary for people with ADHD for ${book} chapter ${chapter}. Language: ${language}. Output only JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tlDr: { type: Type.STRING, description: "A 1-sentence catchy summary." },
          keyTakeaway: { type: Type.STRING, description: "The single most important lesson." },
          modernAnalogy: { type: Type.STRING, description: "A relatable modern comparison." }
        },
        required: ["tlDr", "keyTakeaway", "modernAnalogy"]
      }
    }
  });

  return JSON.parse(response.text.trim());
}

export async function fetchSimplifiedPassage(book: string, chapter: number, language: AppLanguage = 'en', style: TranslationStyle = 'modern'): Promise<BibleVerse[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Retrieve the text for ${book} chapter ${chapter}. Language: ${language}. Style: ${style}. Output as an array of verses. For each verse, provide the verse number and the text. Use a clear, modernization suitable for high-legibility and focus. Focus on making the sentence structure simple for people with ADHD.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            chapter: { type: Type.INTEGER },
            verse: { type: Type.INTEGER },
            text: { type: Type.STRING }
          },
          required: ["chapter", "verse", "text"]
        }
      }
    }
  });

  return JSON.parse(response.text.trim());
}

export async function getDailySpark(language: AppLanguage = 'en'): Promise<{ verse: string, reference: string, focusTip: string }> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Give me one powerful Bible verse of the day for someone with ADHD who needs motivation. Language: ${language}. Include a 'focus tip' on how to apply it today.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verse: { type: Type.STRING },
          reference: { type: Type.STRING },
          focusTip: { type: Type.STRING }
        },
        required: ["verse", "reference", "focusTip"]
      }
    }
  });

  return JSON.parse(response.text.trim());
}

export async function searchBible(query: string, language: AppLanguage = 'en'): Promise<any[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Search the Bible for verses related to "${query}". Language: ${language}. Return the most relevant results (up to 5). Include book, chapter, verse number, and the text. Make the text simple and legible.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            book: { type: Type.STRING },
            chapter: { type: Type.INTEGER },
            verse: { type: Type.INTEGER },
            text: { type: Type.STRING }
          },
          required: ["book", "chapter", "verse", "text"]
        }
      }
    }
  });

  return JSON.parse(response.text.trim());
}
