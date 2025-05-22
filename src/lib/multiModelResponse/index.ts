
import { Message } from "../db";
import { callGeminiAPI, callDeepseekAPI, safeCallAPI } from "./api";
import { buildStudyPlanPrompt } from "./prompts";
import { combineResponses, processResponse, mergeStudyPlanResponses } from "./responseProcessor";
import { StudyPlanParams, ModelResponse } from "./types";
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
      safeCallAPI(async (p) => await callGeminiAPI(p), prompt, "Gemini"),
      safeCallAPI(async (p) => await callDeepseekAPI(p), prompt, "Deepseek")
    ];
    
    // Use Promise.all to execute both API calls in parallel
    const results = await Promise.all([geminiPromise, deepseekPromise]);
    
    // Extract successful responses
    const validResponses: ModelResponse[] = results.filter(result => result.success);
    
    // If we have no valid responses, throw an error
    if (validResponses.length === 0) {
      throw new Error("Both AI models failed to generate responses");
    }
    
    // Combine the successful responses
    const combinedContent = combineResponses(validResponses);
    
    // Process the combined response for better formatting and human-like quality
    const finalResponse = processResponse(combinedContent);
    
    // Store the combined response if chatId is provided
    if (chatId) {
      try {
        // Import dynamically to avoid circular dependency
        const { chatDB } = await import("../db");
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
 * Generate a smart study plan using multiple AI models
 */
export async function generateSmartStudyPlan({
  examName,
  examDate, 
  subjects, 
  dailyHours, 
  language
}: StudyPlanParams): Promise<string> {
  const prompt = buildStudyPlanPrompt({ examName, examDate, subjects, dailyHours, language });

  const [geminiRes, deepSeekRes] = await Promise.all([
    safeCallAPI(callGeminiAPI, prompt, "Gemini"),
    safeCallAPI(callDeepseekAPI, prompt, "Deepseek")
  ]);

  if (!geminiRes.success && !deepSeekRes.success) {
    return language === "en" 
      ? "Sorry, both AI models failed to respond. Please try again later."
      : "सॉरी, दोनों AI मॉडल से जवाब नहीं मिल पाया। कृपया थोड़ी देर बाद प्रयास करें।";
  }

  // Extract text from successful responses
  const responses = [geminiRes, deepSeekRes]
    .filter(res => res.success)
    .map(res => res.text);
  
  if (responses.length === 1) {
    return responses[0];
  }
  
  const finalResponse = mergeStudyPlanResponses(responses[0], responses[1]);
  return finalResponse;
}
