
import { formatTables } from "./tableHelpers";

/**
 * Extracts unique insights from the shorter response that aren't covered in the longer one
 */
export function extractUniqueInsights(shorter: string, longer: string): string {
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
export function makeResponseMoreHuman(text: string): string {
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
