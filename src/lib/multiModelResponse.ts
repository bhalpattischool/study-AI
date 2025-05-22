
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
    
    // NEW STEP: Convert the combined response to a more human-like format
    finalResponse = makeResponseMoreHuman(finalResponse);
    
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

/**
 * Makes the AI response more human-like and conversational
 */
function makeResponseMoreHuman(text: string): string {
  // Remove phrases that sound too formal or AI-like
  text = text.replace(/I'd like to point out that|It is worth noting that|It should be noted that/gi, "Just so you know,");
  text = text.replace(/according to the information provided|based on the information given/gi, "from what I understand");
  text = text.replace(/allow me to explain|let me provide an explanation/gi, "let me explain");
  
  // Add more conversational elements
  text = text.replace(/^(In conclusion|To summarize|In summary)/gmi, "So basically,");
  text = text.replace(/Therefore,|Thus,|Hence,|Consequently,/gi, "So,");
  text = text.replace(/However,|Nevertheless,/gi, "But,");
  text = text.replace(/Additionally,|Furthermore,|Moreover,/gi, "Also,");
  text = text.replace(/Alternatively,/gi, "Or maybe");
  text = text.replace(/For instance,|For example,/gi, "Like");
  
  // Add conversational tone markers
  if (!text.includes("!") && text.length > 200) {
    // Add an exclamation mark if there isn't one and the text is substantial
    const sentences = text.split(". ");
    if (sentences.length > 2) {
      // Add exclamation to an early sentence (for enthusiasm)
      const randomIndex = Math.min(Math.floor(Math.random() * 2) + 1, sentences.length - 1);
      if (!sentences[randomIndex].includes("!") && !sentences[randomIndex].includes("?")) {
        sentences[randomIndex] = sentences[randomIndex] + "!";
      }
      text = sentences.join(". ");
    }
  }
  
  // Break up long paragraphs
  if (text.length > 400) {
    const paragraphs = text.split("\n\n");
    const newParagraphs = [];
    
    for (const paragraph of paragraphs) {
      if (paragraph.length > 300) {
        // Break long paragraphs at sentence boundaries
        const sentences = paragraph.split(". ");
        if (sentences.length > 4) {
          // Create 2 paragraphs
          const midpoint = Math.ceil(sentences.length / 2);
          newParagraphs.push(sentences.slice(0, midpoint).join(". "));
          newParagraphs.push(sentences.slice(midpoint).join(". "));
        } else {
          newParagraphs.push(paragraph);
        }
      } else {
        newParagraphs.push(paragraph);
      }
    }
    
    text = newParagraphs.join("\n\n");
  }
  
  // Add conversational openers or closers if they don't exist
  if (!text.match(/^(Hi|Hey|Hello|Okay|Well|So,|Hmm|Right,|Actually,|Look,|Sure,)/i)) {
    // Add a conversational opener
    const openers = ["Well, ", "So, ", "Actually, ", "Right, ", "Basically, ", ""];
    const randomOpener = openers[Math.floor(Math.random() * openers.length)];
    text = randomOpener + text.charAt(0).toLowerCase() + text.slice(1);
  }
  
  // Add reflective question at the end for engagement (occasionally)
  if (Math.random() < 0.3 && !text.includes("?") && text.length > 100) {
    const questions = [
      "What do you think about that?",
      "Does that make sense?",
      "Hope that helps!",
      "What do you think?",
    ];
    text += "\n\n" + questions[Math.floor(Math.random() * questions.length)];
  }
  
  // Remove "Additional insights:" phrase (leftover from the combining algorithm)
  text = text.replace(/\n\nAdditional insights: /g, "\n\nAlso, ");
  
  return text;
}
