
import { Message } from "../db";
import { ModelResponse } from "./types";
import { toast } from "sonner";

/**
 * Helper function to safely call an API and handle errors
 */
export async function safeCallAPI(
  apiFunc: (prompt: string) => Promise<string>, 
  prompt: string, 
  modelName: string
): Promise<ModelResponse> {
  try {
    const response = await apiFunc(prompt);
    return {
      text: response,
      success: true,
      model: modelName
    };
  } catch (err) {
    console.warn(`${modelName} API failed:`, err);
    return {
      text: "",
      success: false,
      model: modelName
    };
  }
}

/**
 * Call Gemini API
 */
export async function callGeminiAPI(prompt: string): Promise<string> {
  const { generateResponse } = await import("../gemini");
  return await generateResponse(prompt);
}

/**
 * Call Deepseek API
 */
export async function callDeepseekAPI(prompt: string): Promise<string> {
  const { generateResponse } = await import("../deepseek");
  return await generateResponse(prompt);
}
