
import { StudyPlanParams } from "./types";

/**
 * Build a prompt for study plan generation in the appropriate language
 */
export function buildStudyPlanPrompt({
  examName,
  examDate,
  subjects,
  dailyHours,
  language
}: StudyPlanParams): string {
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
