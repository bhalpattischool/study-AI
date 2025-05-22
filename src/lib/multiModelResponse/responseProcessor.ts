
import { Message } from "../db";
import { ModelResponse } from "./types";
import { containsTable, getBetterTableResponse, formatTables } from "./tableHelpers";
import { extractUniqueInsights, makeResponseMoreHuman } from "./responseEnhancer";

/**
 * Combines multiple model responses into a single coherent response
 */
export function combineResponses(validResponses: ModelResponse[]): string {
  // If we only have one response, use it
  if (validResponses.length === 1) {
    return validResponses[0].text;
  }
  
  // Extract the text from each response
  const responseTexts = validResponses.map(r => r.text);
  
  // For combining, we'll take the best elements from both:
  const [resp1, resp2] = responseTexts;
  
  // Use simple heuristics to determine which response might be better
  const longerResponse = resp1.length >= resp2.length ? resp1 : resp2;
  const shorterResponse = resp1.length < resp2.length ? resp1 : resp2;
  
  // Check if either response contains table-like content
  const containsTableMarkdown = containsTable(longerResponse) || containsTable(shorterResponse);
  
  let finalResponse: string;
  
  if (containsTableMarkdown) {
    // If tables are detected, prioritize the response with the better-formatted table
    finalResponse = getBetterTableResponse(resp1, resp2);
  } else {
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
  
  return finalResponse;
}

/**
 * Process the final response by formatting tables and making it more human-like
 */
export function processResponse(response: string): string {
  // Format tables properly if they exist
  const withFormattedTables = formatTables(response);
  
  // Convert the response to a more human-like format
  return makeResponseMoreHuman(withFormattedTables);
}

/**
 * Merge responses from different models by removing duplicates
 * Used for study plan generation
 */
export function mergeStudyPlanResponses(res1: string, res2: string): string {
  if (!res1) return res2;
  if (!res2) return res1;

  const lines1 = res1.split('\n');
  const lines2 = res2.split('\n');

  const merged = new Set([...lines1, ...lines2]); // Remove duplicates
  return Array.from(merged).join('\n');
}
