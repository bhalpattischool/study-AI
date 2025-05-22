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
 * Helper function to safely call an API and handle errors
 */
async function safeCallAPI(apiFunc: (prompt: string) => Promise<string>, prompt: string): Promise<string> {
  try {
    return await apiFunc(prompt);
  } catch (err) {
    console.warn("API failed:", err);
    return ""; // खाली string भेजो ताकि मर्जिंग फेल न हो
  }
}

/**
 * Call Gemini API for study plan specifically
 */
async function callGeminiAPI(prompt: string): Promise<string> {
  const { generateResponse } = await import("./gemini");
  return await generateResponse(prompt);
}

/**
 * Call Deepseek API for study plan specifically
 */
async function callDeepSeekAPI(prompt: string): Promise<string> {
  const { generateResponse } = await import("./deepseek");
  return await generateResponse(prompt);
}

/**
 * Merge responses from different models by removing duplicates
 */
function mergeSmartResponses(res1: string, res2: string): string {
  if (!res1) return res2;
  if (!res2) return res1;

  const lines1 = res1.split('\n');
  const lines2 = res2.split('\n');

  const merged = new Set([...lines1, ...lines2]); // डुप्लिकेट हटाओ
  return Array.from(merged).join('\n');
}

/**
 * Build a prompt for study plan generation in the appropriate language
 */
function buildPrompt(
  examName: string,
  examDate: string,
  subjects: string,
  dailyHours: string,
  language: string
): string {
  if (language === "en") {
    return `Create a detailed day-by-day study plan for my ${examName} exam on ${examDate}. 
    I need to study these subjects: ${subjects}. I can dedicate ${dailyHours} hours daily.
    
    Please include:
    1. A specific daily schedule with EXACT topics from each subject to study each day
    2. How many minutes to spend on each topic
    3. Which chapters and sub-topics to cover on specific days
    4. When to take breaks and for how long
    5. When to do revision sessions
    
    FORMAT:
    - Organize by DAY (Day 1, Day 2, etc.)
    - For each day, list specific TASKS with:
      * Subject name
      * Chapter number and name
      * Specific topic
      * Duration in minutes
      * Priority level
      * Learning objective
    
    Make it very detailed and specific, like a teacher would prepare for their student.`;
  } else {
    return `मेरी ${examName} परीक्षा के लिए ${examDate} तक एक विस्तृत दिन-प्रतिदिन अध्ययन योजना बनाएं।
    मुझे इन विषयों का अध्ययन करने की आवश्यकता है: ${subjects}। मैं दैनिक ${dailyHours} घंटे समर्पित कर सकता हूं।
    
    कृपया इन चीजों को शामिल करें:
    1. प्रत्येक दिन के लिए एक विशिष्ट कार्यक्रम जिसमें प्रत्येक विषय के सटीक टॉपिक्स का उल्लेख हो
    2. प्रत्येक टॉपिक पर कितने मिनट बिताने हैं
    3. किस दिन कौन से अध्याय और उप-विषय कवर करने हैं
    4. कब ब्रेक लेना है और कितने समय के लिए
    5. कब रिवीजन सेशन करने हैं
    
    प्रारूप:
    - दिन के अनुसार व्यवस्थित करें (दिन 1, दिन 2, आदि)
    - प्रत्येक दिन के लिए, विशिष्ट कार्यों की सूची बनाएं:
      * विषय का नाम
      * अध्याय संख्या और नाम
      * विशिष्ट टॉपिक
      * मिनटों में अवधि
      * प्राथमिकता स्तर
      * सीखने का उद्देश्य
    
    इसे बहुत विस्तृत और विशिष्ट बनाएं, जैसे कि एक शिक्षक अपने छात्र के लिए तैयार करेगा।`;
  }
}

/**
 * Generate a smart study plan using multiple AI models
 */
export async function generateSmartStudyPlan(
  examName: string, 
  examDate: string, 
  subjects: string, 
  dailyHours: string, 
  language: string
): Promise<string> {
  const prompt = buildPrompt(examName, examDate, subjects, dailyHours, language);

  const [geminiRes, deepSeekRes] = await Promise.all([
    safeCallAPI(callGeminiAPI, prompt),
    safeCallAPI(callDeepSeekAPI, prompt)
  ]);

  if (!geminiRes && !deepSeekRes) {
    return language === "en" 
      ? "Sorry, both AI models failed to respond. Please try again later."
      : "सॉरी, दोनों AI मॉडल से जवाब नहीं मिल पाया। कृपया थोड़ी देर बाद प्रयास करें।";
  }

  const finalResponse = mergeSmartResponses(geminiRes, deepSeekRes);
  return finalResponse;
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
  const table1Lines = resp1.split('\n').filter(line => line.includes('|') && line.startsWith('|'));
  const table2Lines = resp2.split('\n').filter(line => line.includes('|') && line.startsWith('|'));
  
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
