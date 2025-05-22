
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
      
      // Check if either response contains table-like content
      const containsTableMarkdown = shouldPreserveTable(longerResponse) || shouldPreserveTable(shorterResponse);
      
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
    }
    
    // Format tables properly if they exist
    finalResponse = formatTablesInResponse(finalResponse);
    
    // Convert the combined response to a more human-like format
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
 * Checks if a response contains a Markdown table
 */
function shouldPreserveTable(text: string): boolean {
  // Check for markdown table syntax (rows that have | character)
  const tableLines = text.split('\n').filter(line => 
    line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')
  );
  
  // We need at least 2 rows (header + separator) to consider this a table
  if (tableLines.length >= 2) {
    // Check if there's a separator row (like |---|---|)
    const hasSeparator = tableLines.some(line => 
      /\|[\s\-:]+\|/.test(line)
    );
    
    return hasSeparator;
  }
  
  return false;
}

/**
 * Selects the response with the better formatted table
 */
function getBetterTableResponse(resp1: string, resp2: string): string {
  const table1Lines = resp1.split('\n').filter(line => line.includes('|') && line.trim().startsWith('|'));
  const table2Lines = resp2.split('\n').filter(line => line.includes('|') && line.trim().startsWith('|'));
  
  // Prefer the response with more table rows
  if (table1Lines.length >= table2Lines.length) {
    return resp1;
  } else {
    return resp2;
  }
}

/**
 * Ensures tables in the response are properly formatted
 */
function formatTablesInResponse(text: string): string {
  // Find all table segments in the text
  const lines = text.split('\n');
  let inTable = false;
  let tableStart = -1;
  const tableSections: [number, number][] = [];
  
  // Identify table sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const isTableRow = line.includes('|') && line.startsWith('|') && line.endsWith('|');
    
    if (isTableRow && !inTable) {
      inTable = true;
      tableStart = i;
    } else if (!isTableRow && inTable) {
      inTable = false;
      tableSections.push([tableStart, i - 1]);
    }
  }
  
  // If we were still in a table at the end
  if (inTable) {
    tableSections.push([tableStart, lines.length - 1]);
  }
  
  // Fix each table section
  for (const [start, end] of tableSections) {
    // Need at least 2 rows for a valid table (header + content)
    if (end - start < 1) continue;
    
    const tableRows = lines.slice(start, end + 1);
    
    // Check if we need to add a separator row
    const hasSeparator = tableRows.some(row => /\|[\s\-:]+\|/.test(row));
    
    if (tableRows.length >= 2 && !hasSeparator) {
      // Insert separator row after first row
      const headerRow = tableRows[0];
      const columnCount = (headerRow.match(/\|/g) || []).length - 1;
      const separatorRow = '|' + Array(columnCount).fill('---').join('|') + '|';
      
      lines.splice(start + 1, 0, separatorRow);
    }
    
    // Ensure all rows have the same number of columns
    if (tableRows.length >= 2) {
      const columnCounts = tableRows.map(row => (row.match(/\|/g) || []).length - 1);
      const maxColumns = Math.max(...columnCounts);
      
      for (let i = start; i <= end; i++) {
        const currentColumns = (lines[i].match(/\|/g) || []).length - 1;
        if (currentColumns < maxColumns) {
          // Add missing columns
          lines[i] = lines[i].substring(0, lines[i].length - 1) + 
                    '|'.repeat(maxColumns - currentColumns) + '|';
        }
      }
    }
  }
  
  return lines.join('\n');
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
  // Skip humanizing table sections
  const tableSections: [number, number][] = [];
  const lines = text.split('\n');
  let inTable = false;
  let tableStart = -1;
  
  // Find table sections to preserve
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const isTableRow = line.includes('|') && line.startsWith('|') && line.endsWith('|');
    
    if (isTableRow && !inTable) {
      inTable = true;
      tableStart = i;
    } else if (!isTableRow && inTable) {
      inTable = false;
      tableSections.push([tableStart, i - 1]);
    }
  }
  
  if (inTable) {
    tableSections.push([tableStart, lines.length - 1]);
  }
  
  // Extract tables to preserve them
  const preservedTables = tableSections.map(([start, end]) => {
    return lines.slice(start, end + 1).join('\n');
  });
  
  // Remove table sections from text for processing
  let textWithoutTables = text;
  let offset = 0;
  
  for (let i = 0; i < tableSections.length; i++) {
    const [start, end] = tableSections[i];
    const tableText = lines.slice(start, end + 1).join('\n');
    const startPos = textWithoutTables.indexOf(tableText, offset);
    if (startPos !== -1) {
      textWithoutTables = textWithoutTables.substring(0, startPos) + 
                          `[TABLE_PLACEHOLDER_${i}]` + 
                          textWithoutTables.substring(startPos + tableText.length);
      offset = startPos + `[TABLE_PLACEHOLDER_${i}]`.length;
    }
  }
  
  // Remove phrases that sound too formal or AI-like
  textWithoutTables = textWithoutTables.replace(/I'd like to point out that|It is worth noting that|It should be noted that/gi, "Just so you know,");
  textWithoutTables = textWithoutTables.replace(/according to the information provided|based on the information given/gi, "from what I understand");
  textWithoutTables = textWithoutTables.replace(/allow me to explain|let me provide an explanation/gi, "let me explain");
  
  // Add more conversational elements
  textWithoutTables = textWithoutTables.replace(/^(In conclusion|To summarize|In summary)/gmi, "So basically,");
  textWithoutTables = textWithoutTables.replace(/Therefore,|Thus,|Hence,|Consequently,/gi, "So,");
  textWithoutTables = textWithoutTables.replace(/However,|Nevertheless,/gi, "But,");
  textWithoutTables = textWithoutTables.replace(/Additionally,|Furthermore,|Moreover,/gi, "Also,");
  textWithoutTables = textWithoutTables.replace(/Alternatively,/gi, "Or maybe");
  textWithoutTables = textWithoutTables.replace(/For instance,|For example,/gi, "Like");
  
  // Add conversational tone markers
  if (!textWithoutTables.includes("!") && textWithoutTables.length > 200) {
    // Add an exclamation mark if there isn't one and the text is substantial
    const sentences = textWithoutTables.split(". ");
    if (sentences.length > 2) {
      // Add exclamation to an early sentence (for enthusiasm)
      const randomIndex = Math.min(Math.floor(Math.random() * 2) + 1, sentences.length - 1);
      if (!sentences[randomIndex].includes("!") && !sentences[randomIndex].includes("?")) {
        sentences[randomIndex] = sentences[randomIndex] + "!";
      }
      textWithoutTables = sentences.join(". ");
    }
  }
  
  // Break up long paragraphs
  if (textWithoutTables.length > 400) {
    const paragraphs = textWithoutTables.split("\n\n");
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
    
    textWithoutTables = newParagraphs.join("\n\n");
  }
  
  // Add conversational openers or closers if they don't exist
  if (!textWithoutTables.match(/^(Hi|Hey|Hello|Okay|Well|So,|Hmm|Right,|Actually,|Look,|Sure,)/i)) {
    // Add a conversational opener
    const openers = ["Well, ", "So, ", "Actually, ", "Right, ", "Basically, ", ""];
    const randomOpener = openers[Math.floor(Math.random() * openers.length)];
    textWithoutTables = randomOpener + textWithoutTables.charAt(0).toLowerCase() + textWithoutTables.slice(1);
  }
  
  // Add reflective question at the end for engagement (occasionally)
  if (Math.random() < 0.3 && !textWithoutTables.includes("?") && textWithoutTables.length > 100) {
    const questions = [
      "What do you think about that?",
      "Does that make sense?",
      "Hope that helps!",
      "What do you think?",
    ];
    textWithoutTables += "\n\n" + questions[Math.floor(Math.random() * questions.length)];
  }
  
  // Remove "Additional insights:" phrase (leftover from the combining algorithm)
  textWithoutTables = textWithoutTables.replace(/\n\nAdditional insights: /g, "\n\nAlso, ");
  
  // Reinsert tables
  let finalText = textWithoutTables;
  for (let i = 0; i < preservedTables.length; i++) {
    finalText = finalText.replace(`[TABLE_PLACEHOLDER_${i}]`, '\n\n' + preservedTables[i] + '\n\n');
  }
  
  return finalText;
}

