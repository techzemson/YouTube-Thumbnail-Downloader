import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

// In a real production app, you might want to proxy this through a backend to protect the key,
// but for this client-side demo, we use the env variable.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const analyzeThumbnail = async (base64Image: string): Promise<AIAnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. AI features are unavailable.");
  }

  const model = "gemini-2.5-flash"; // Efficient for image analysis

  const prompt = `
    Analyze this YouTube thumbnail as an expert social media marketer and graphic designer.
    Provide a structured JSON response.
    
    Evaluate:
    1. Visual clarity and text readability.
    2. Emotional impact.
    3. Click-through potential.
    
    Return the response in this exact JSON schema:
    {
      "score": number (0-100),
      "strengths": string[] (3 bullet points),
      "weaknesses": string[] (3 bullet points),
      "suggestions": string[] (3 actionable improvements),
      "summary": string (1 short paragraph)
    }
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
            summary: { type: Type.STRING }
          },
          required: ["score", "strengths", "weaknesses", "suggestions", "summary"]
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
