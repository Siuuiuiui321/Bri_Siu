
import { GoogleGenAI, Type } from "@google/genai";
import { Activity } from "../types";

// Removed global API_KEY constant to ensure it's fetched directly where needed.

export const fetchAIActivities = async (
  destination: string,
  interests: string[]
): Promise<Activity[]> => {
  // Always use new GoogleGenAI({ apiKey: process.env.API_KEY });
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate a list of 15 interesting activities/places for a traveler visiting ${destination}. 
  The traveler is interested in: ${interests.join(', ')}. 
  Include a mix of "must-see" landmarks and hidden gems. 
  Each activity must have a descriptive name, a short compelling description, and tags.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            mapQuery: { type: Type.STRING },
          },
          required: ["id", "name", "description", "type", "tags", "mapQuery"],
        },
      },
    },
  });

  try {
    // Accessing .text as a property, not a method.
    const rawData = response.text || '[]';
    const activities: Activity[] = JSON.parse(rawData);
    
    // Add placeholder images and match types
    return activities.map((act, index) => ({
      ...act,
      id: act.id || `act-${index}`,
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(act.name)}/800/600`,
      matchType: index % 3 === 0 ? 'wildcard' : 'match'
    }));
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return [];
  }
};

export const fetchCitySuggestions = async (input: string): Promise<string[]> => {
  if (input.length < 3) return [];
  
  // Always use new GoogleGenAI({ apiKey: process.env.API_KEY });
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Suggest 5 real-world city names (City, Country) that match or start with "${input}". Return as a simple JSON string array.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    // Accessing .text as a property, not a method.
    return JSON.parse(response.text || '[]');
  } catch {
    return [];
  }
};
