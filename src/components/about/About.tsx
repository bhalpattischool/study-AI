
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea } from "@/components/ui/scroll-area";

const About = () => {
  const { language } = useLanguage();

  const isHindi = language === 'hi';
  
  return (
    <ScrollArea className="h-full px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          {isHindi ? 'स्टडी AI के बारे में' : 'About Study AI'}
        </h1>
        
        <div className="space-y-6">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              {isHindi ? 'परिचय' : 'Introduction'}
            </h2>
            <p className="text-muted-foreground">
              {isHindi 
                ? 'स्टडी AI एक अध्ययन सहायक प्लेटफॉर्म है जो छात्रों को अपनी पढ़ाई में मदद करने के लिए AI का उपयोग करता है। यह प्लेटफॉर्म क्विज़, नोट्स, अध्ययन योजना, होमवर्क सहायता और प्रेरणा प्रदान करता है।'
                : 'Study AI is an AI-powered study assistant platform that helps students with their studies. The platform provides quizzes, notes, study plans, homework assistance, and motivation.'}
            </p>
          </section>

          <Separator />

          {/* Getting Started */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              {isHindi ? 'शुरुआत करें' : 'Getting Started'}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-1">
                  {isHindi ? 'लॉगिन / साइन अप' : 'Login / Sign Up'}
                </h3>
                <p className="text-muted-foreground">
                  {isHindi
                    ? '1. होमपेज पर जाएं और "साइन इन" बटन पर क्लिक करें।\n2. यदि आपके पास पहले से खाता है, तो अपना ईमेल और पासवर्ड दर्ज करें।\n3. यदि आपके पास खाता नहीं है, तो "साइन अप" पर क्लिक करें और अपनी जानकारी दर्ज करें।'
                    : '1. Go to the homepage and click on "Sign In" button.\n2. If you already have an account, enter your email and password.\n3. If you don\'t have an account, click on "Sign Up" and enter your information.'}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">
                  {isHindi ? 'होम पेज' : 'Home Page'}
                </h3>
                <p className="text-muted-foreground">
                  {isHindi
                    ? 'होम पेज से आप AI चैट कर सकते हैं और अपने अधिकांश टूल्स तक पहुंच सकते हैं। साइडबार का उपयोग करके विभिन्न सेक्शन पर नेविगेट करें।'
                    : 'From the home page, you can chat with AI and access most of your tools. Use the sidebar to navigate to different sections.'}
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Features */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              {isHindi ? 'मुख्य फीचर्स' : 'Key Features'}
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-1">
                  {isHindi ? 'AI चैट' : 'AI Chat'}
                </h3>
                <p className="text-muted-foreground">
                  {isHindi
                    ? 'AI के साथ चैट करें और अपने अध्ययन से संबंधित प्रश्न पूछें। आप अपने संदेशों को बुकमार्क कर सकते हैं और बाद में देख सकते हैं।'
                    : 'Chat with AI and ask questions related to your studies. You can bookmark messages and view them later.'}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-1">
                  {isHindi ? 'क्विज़ जनरेटर' : 'Quiz Generator'}
                </h3>
                <p className="text-muted-foreground">
                  {isHindi
                    ? '1. क्विज़ जनरेटर फीचर पर जाएं।\n2. विषय, कठिनाई स्तर और प्रश्नों की संख्या चुनें।\n3. "जनरेट क्विज़" बटन पर क्लिक करें। AI आपके लिए एक क्विज़ तैयार करेगा।'
                    : '1. Go to the Quiz Generator feature.\n2. Choose the topic, difficulty level, and number of questions.\n3. Click on "Generate Quiz" button. The AI will create a quiz for you.'}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-1">
                  {isHindi ? 'नोट्स जनरेटर' : 'Notes Generator'}
                </h3>
                <p className="text-muted-foreground">
                  {isHindi
                    ? '1. नोट्स जनरेटर फीचर पर जाएं।\n2. विषय और नोट फॉर्मेट (संक्षिप्त, व्यापक, परीक्षा केंद्रित) चुनें।\n3. "जनरेट नोट्स" बटन पर क्लिक करें। AI आपके लिए नोट्स तैयार करेगा।'
                    : '1. Go to the Notes Generator feature.\n2. Choose the topic and note format (concise, comprehensive, exam focused).\n3. Click on "Generate Notes" button. The AI will create notes for you.'}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-1">
                  {isHindi ? 'अध्ययन योजनाकार' : 'Study Planner'}
                </h3>
                <p className="text-muted-foreground">
                  {isHindi
                    ? '1. अध्ययन योजनाकार फीचर पर जाएं।\n2. परीक्षा का नाम, तिथि, विषय और प्रति दिन उपलब्ध घंटे दर्ज करें।\n3. "योजना बनाएं" बटन पर क्लिक करें। AI आपके लिए एक अध्ययन योजना तैयार करेगा।'
                    : '1. Go to the Study Planner feature.\n2. Enter the exam name, date, subjects, and available hours per day.\n3. Click on "Generate Plan" button. The AI will create a study plan for you.'}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-1">
                  {isHindi ? 'होमवर्क सहायक' : 'Homework Assistant'}
                </h3>
                <p className="text-muted-foreground">
                  {isHindi
                    ? '1. होमवर्क सहायक फीचर पर जाएं।\n2. विषय, समस्या का विवरण और सहायता का प्रकार (चरण-दर-चरण, संकेत, या काम की जांच) चुनें।\n3. "सहायता प्राप्त करें" बटन पर क्लिक करें। AI आपकी मदद करेगा।'
                    : '1. Go to the Homework Assistant feature.\n2. Choose the subject, describe your problem, and select the type of help (step-by-step, hint, or check work).\n3. Click on "Get Help" button. The AI will assist you.'}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-1">
                  {isHindi ? 'प्रेरणा प्रणाली' : 'Motivation System'}
                </h3>
                <p className="text-muted-foreground">
                  {isHindi
                    ? '1. प्रेरणा प्रणाली फीचर पर जाएं।\n2. प्रेरणा प्रकार (अध्ययन प्रेरणा, परीक्षा तैयारी, टालमटोल पर काबू पाना, दैनिक सकारात्मक कथन, या अध्ययन ऊर्जा बढ़ावा) चुनें।\n3. "प्रेरित करें" बटन पर क्लिक करें। AI आपको प्रेरणादायक सामग्री प्रदान करेगा।'
                    : '1. Go to the Motivation System feature.\n2. Choose the motivation type (study motivation, exam preparation, overcome procrastination, daily affirmations, or study energy boost).\n3. Click on "Motivate" button. The AI will provide you with motivational content.'}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-1">
                  {isHindi ? 'शिक्षक मोड' : 'Teacher Mode'}
                </h3>
                <p className="text-muted-foreground">
                  {isHindi
                    ? '1. शिक्षक मोड फीचर पर जाएं।\n2. अध्याय, विषय, अपना नाम (वैकल्पिक), पढ़ाने का तरीका, सीखने का तरीका, और क्रिया (नोट्स बनाएं या सिर्फ पढ़ाएं) चुनें।\n3. "पढ़ाना शुरू करें" बटन पर क्लिक करें। AI आपको पढ़ाएगा।'
                    : '1. Go to the Teacher Mode feature.\n2. Choose the chapter, subject, your name (optional), teaching style, learning approach, and action (generate notes or just teach).\n3. Click on "Start Teaching" button. The AI will teach you.'}
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Student Activities */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              {isHindi ? 'छात्र गतिविधियाँ' : 'Student Activities'}
            </h2>
            <p className="text-muted-foreground">
              {isHindi
                ? 'छात्र गतिविधियां आपको अपनी प्रगति को ट्रैक करने, लक्ष्य निर्धारित करने, और अन्य छात्रों के साथ लीडरबोर्ड पर प्रतिस्पर्धा करने की अनुमति देती हैं। आप अपने प्रोफ़ाइल QR कोड को साझा करके अन्य छात्रों से कनेक्ट कर सकते हैं।'
                : 'Student Activities allow you to track your progress, set goals, and compete with other students on the leaderboard. You can connect with other students by sharing your profile QR code.'}
            </p>
          </section>

          <Separator />

          {/* Profile Management */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              {isHindi ? 'प्रोफ़ाइल प्रबंधन' : 'Profile Management'}
            </h2>
            <p className="text-muted-foreground">
              {isHindi
                ? '1. प्रोफ़ाइल पेज पर जाएं (साइडबार में प्रोफ़ाइल आइकन पर क्लिक करें)।\n2. आप अपनी चैट हिस्ट्री, सेव किए गए मैसेज, शिक्षक चैट और छात्र गतिविधियां देख सकते हैं।\n3. फीडबैक भेजने या लॉग आउट करने के विकल्प भी उपलब्ध हैं।'
                : '1. Go to the Profile page (click on the profile icon in the sidebar).\n2. You can view your chat history, saved messages, teacher chats, and student activities.\n3. Options to send feedback or log out are also available.'}
            </p>
          </section>

          <Separator />

          {/* Language Settings */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              {isHindi ? 'भाषा सेटिंग्स' : 'Language Settings'}
            </h2>
            <p className="text-muted-foreground">
              {isHindi
                ? 'स्टडी AI अंग्रेजी और हिंदी दोनों भाषाओं में उपलब्ध है। भाषा बदलने के लिए, प्रोफ़ाइल सेक्शन में जाएं और अपनी पसंदीदा भाषा चुनें।'
                : 'Study AI is available in both English and Hindi languages. To change the language, go to the profile section and choose your preferred language.'}
            </p>
          </section>

          <Separator />

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              {isHindi ? 'संपर्क जानकारी' : 'Contact Information'}
            </h2>
            <p className="text-muted-foreground">
              {isHindi
                ? 'किसी भी प्रश्न या सहायता के लिए, कृपया निम्नलिखित पर संपर्क करें:'
                : 'For any questions or assistance, please contact:'}
            </p>
            <div className="mt-2 space-y-1">
              <p><strong>{isHindi ? 'निर्माता' : 'Created by'}</strong>: Ajit Kumar</p>
              <p><strong>{isHindi ? 'मोबाइल' : 'Mobile'}</strong>: 9504797910</p>
              <p><strong>{isHindi ? 'ईमेल' : 'Email'}</strong>: ajit91884270@gmail.com</p>
            </div>
          </section>
        </div>
      </div>
    </ScrollArea>
  );
};

export default About;
