
import { toast } from "sonner";
import { Message } from "./db";
import { chatDB } from "./db";

const API_KEY = "sk-3bfbebf1f9044fbe8eb018d7612e9778";
const API_URL = "https://api.deepseek.com/chat/completions";

export async function generateResponse(prompt: string, history: Message[] = [], chatId?: string): Promise<string> {
  try {
    // Format conversation history for the Deepseek API
    const messages = history.map(msg => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content
    }));

    // Add system message at the beginning
    const systemMessage = {
      role: "system",
      content: "You are a helpful AI assistant for students. Provide clear, concise, and accurate information."
    };

    // Add the current prompt to the history
    messages.push({
      role: "user",
      content: prompt
    });

    const finalMessages = [systemMessage, ...messages];
    console.log("Sending complete history to Deepseek API:", finalMessages);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: finalMessages,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Deepseek API error:", errorData);
      throw new Error(`API error: ${errorData.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from Deepseek API");
    }
    
    const responseText = data.choices[0].message.content;
    
    // If chatId is provided, store the response in local storage via chatDB
    if (chatId) {
      try {
        await chatDB.addMessage(chatId, responseText, "bot");
        console.log("Response stored in local storage for chat:", chatId);
      } catch (storageError) {
        console.error("Error storing response in local storage:", storageError);
        // Continue even if storage fails - don't block the response
      }
    }

    return responseText;
  } catch (error) {
    console.error("Error calling Deepseek API:", error);
    toast.error("Failed to get response from AI");
    throw error;
  }
}

export async function generateStudyPlan(
  examName: string, 
  examDate: string, 
  subjects: string, 
  dailyHours: string, 
  language: string
): Promise<string> {
  // Construct a detailed prompt for the study plan
  let prompt = '';
  
  if (language === 'en') {
    prompt = `Create a detailed day-by-day study plan for my ${examName} exam on ${examDate}. 
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
    prompt = `मेरी ${examName} परीक्षा के लिए ${examDate} तक एक विस्तृत दिन-प्रतिदिन अध्ययन योजना बनाएं।
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
  
  // Call the Deepseek API for the study plan
  return await generateResponse(prompt);
}
