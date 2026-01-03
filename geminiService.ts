
import { GoogleGenAI, Type } from "@google/genai";
import { Product, UserPreferences } from "../types";

// Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Re-ranks products based on user preferences, search history, 
 * seller reputation, and location relevance using Gemini.
 */
export async function getAiRecommendedProducts(
  products: Product[],
  preferences: UserPreferences,
  userLocation?: { lat: number, lng: number }
): Promise<string[]> {
  try {
    const locationContext = userLocation 
      ? `The user is currently located at coordinates (${userLocation.lat}, ${userLocation.lng}).`
      : "The user's specific location is unknown, but they are looking for products across Africa.";

    const prompt = `
      As an AI market assistant for the African continent, rank the following product IDs from most relevant to least relevant for the user.
      
      User Context:
      - Favorite Categories: ${preferences.favoriteCategories.join(', ')}
      - Search History: ${preferences.searchHistory.join(', ')}
      - ${locationContext}
      
      Ranking Criteria (Prioritize in this order):
      1. Alignment with favorite categories and search history.
      2. Geographic proximity (closer is better).
      3. Seller reputation (higher rating is better).
      4. General product appeal.

      Products List:
      ${products.map(p => 
        `ID: ${p.id}, Title: ${p.title}, Category: ${p.category}, Seller: ${p.sellerName}, Seller Rating: ${p.sellerRating}/5, Location: ${p.city}, ${p.country} (Lat: ${p.lat}, Lng: ${p.lng})`
      ).join('\n')}
      
      Return ONLY a JSON array of product IDs in order of relevance.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const result = JSON.parse(response.text || '[]');
    return result;
  } catch (error) {
    console.error("Gemini recommendation error:", error);
    return products.map(p => p.id); // Fallback to original order
  }
}

/**
 * Generates a helpful summary for a chat negotiation.
 */
export async function getNegotiationAdvice(product: Product, chatHistory: string[]): Promise<string> {
  try {
    const prompt = `
      Product: ${product.title}
      Price: ${product.currency} ${product.price}
      Category: ${product.category}
      Seller Rating: ${product.sellerRating}/5
      
      Chat snippet:
      ${chatHistory.slice(-5).join('\n')}
      
      Suggest a short, helpful advice for the buyer/seller to close this deal fairly in the African market context.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    // Access .text property directly as per latest SDK
    return response.text || "Keep negotiating for a fair deal!";
  } catch (error) {
    return "Focus on establishing trust before payment.";
  }
}
