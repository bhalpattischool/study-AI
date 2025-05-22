
import { Message } from "./db";
import { generateResponse as generateGeminiResponse } from "./gemini";
import { generateResponse as generateDeepseekResponse } from "./deepseek";
import { toast } from "sonner";

/**
 * Combines responses from multiple AI models to create a stronger answer
 * @param prompt The user's question
 * @param history The conversation history
 * @param chatId Optional chat ID for storing responses
 * @returns The combined response text
 */
export async function generateCombinedResponse(
  prompt: string, 
  history: Message[] = [], 
  chatId?: string
): Promise<string> {
  try {
    // Send the same prompt to both APIs in parallel
    const [geminiPromise, deepseekPromise] = [
      generateGeminiResponse(prompt, history),
      generateDeepseekResponse(prompt, history)
    ];
    
    // Use Promise.allSettled to handle cases where one API might fail
    const results = await Promise.allSettled([geminiPromise, deepseekPromise]);
    
    // Extract successful responses
    const validResponses: string[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        validResponses.push(result.value);
      } else {
        console.warn(`Model ${index === 0 ? 'Gemini' : 'Deepseek'} failed to respond:`, result.reason);
      }
    });
    
    // If we have no valid responses, throw an error
    if (validResponses.length === 0) {
      throw new Error("Both AI models failed to generate responses");
    }
    
    // Simple algorithm to combine responses:
    // 1. If we only have one response, use it
    // 2. If we have responses from both models, combine them
    let finalResponse: string;
    
    if (validResponses.length === 1) {
      finalResponse = validResponses[0];
    } else {
      // For combining, we'll take the best elements from both:
      // - Use the longer response as a base (often contains more details)
      // - Extract key points from both responses
      const [resp1, resp2] = validResponses;
      
      // Use simple heuristics to determine which response might be better
      const longerResponse = resp1.length >= resp2.length ? resp1 : resp2;
      const shorterResponse = resp1.length < resp2.length ? resp1 : resp2;
      
      // Generate a combined response
      // This is a simple approach - the longer response first, then a summary of key points from the shorter one
      finalResponse = longerResponse;
      
      // Find a natural breakpoint to append insights from the shorter response
      const sentencesFromShorter = extractUniqueInsights(shorterResponse, longerResponse);
      
      if (sentencesFromShorter && sentencesFromShorter.trim().length > 0) {
        // Only add additional insights if they add value
        finalResponse += `\n\nAdditional insights: ${sentencesFromShorter}`;
      }
    }
    
    // Store the combined response if chatId is provided
    if (chatId) {
      try {
        // Import dynamically to avoid circular dependency
        const { chatDB } = await import("./db");
        await chatDB.addMessage(chatId, finalResponse, "bot");
      } catch (storageError) {
        console.error("Error storing response in local storage:", storageError);
      }
    }
    
    return finalResponse;
  } catch (error) {
    console.error("Error generating combined response:", error);
    toast.error("Failed to generate combined response");
    throw error;
  }
}

/**
 * Extracts unique insights from the shorter response that aren't covered in the longer one
 */
function extractUniqueInsights(shorter: string, longer: string): string {
  // Split into sentences (simple approach)
  const shorterSentences = shorter.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Look for sentences in the shorter response that offer unique perspectives
  const uniqueSentences = shorterSentences.filter(sentence => {
    // Check if this sentence contains important keywords not found in the longer response
    const words = sentence.split(/\s+/)
      .map(w => w.toLowerCase().replace(/[^a-z0-9]/g, ''))
      .filter(w => w.length > 5); // Only consider significant words
      
    // Look for sentences with keywords not in the longer response
    return words.some(word => !longer.toLowerCase().includes(word));
  });
  
  // Return a condensed version of unique insights
  return uniqueSentences.slice(0, 3).join(". ") + (uniqueSentences.length > 0 ? "." : "");
}
