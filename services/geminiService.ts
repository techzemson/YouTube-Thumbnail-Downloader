import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const analyzeThumbnail = async (base64Image: string): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. AI features are unavailable.");
  }

  const model = "gemini-2.5-flash"; 

  const prompt = `
    Analyze this YouTube thumbnail as an expert social media marketer and graphic designer.
    
    Tasks:
    1. Score the design (0-100).
    2. Identify strengths and weaknesses.
    3. Suggest actionable improvements.
    4. Generate 5-7 viral SEO hashtags relevant to the visual content.
    5. Write a catchy, engaging social media caption for this video.
    6. Extract the 4 dominant colors as Hex codes.
    7. Determine the emotional sentiment (e.g., Exciting, Scary, Educational).

    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            caption: { type: Type.STRING },
            dominantColors: { type: Type.ARRAY, items: { type: Type.STRING } },
            sentiment: { type: Type.STRING }
          },
          required: ["score", "strengths", "weaknesses", "suggestions", "summary", "hashtags", "caption", "dominantColors", "sentiment"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    } else {
      throw new Error("Empty response from AI");
    }

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};