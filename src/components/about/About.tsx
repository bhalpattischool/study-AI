
import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { useLanguage } from '@/contexts/LanguageContext';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  BookOpen, 
  Calendar, 
  Brain, 
  Calculator, 
  GraduationCap, 
  BookOpenCheck,
  FileText,
  Clock,
  UserPlus,
  Lock,
  Mail,
  Target,
  Star,
  Languages,
  HelpCircle,
  Phone
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const About = () => {
  const { language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  // Function to toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const isHindi = language === 'hi';

  return (
    <ScrollArea className="h-full">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with language toggle */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {isHindi ? 'स्टडी AI के बारे में' : 'About Study AI'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {isHindi ? 'आपका व्यक्तिगत अध्ययन सहायक' : 'Your personal study assistant'}
            </p>
          </div>
          
          <Button 
            onClick={toggleLanguage} 
            variant="outline" 
            className="flex items-center gap-2 border-purple-200 dark:border-purple-800"
          >
            <Languages className="h-4 w-4" />
            {isHindi ? 'English' : 'हिंदी'}
          </Button>
        </div>
        
        {/* Tabs for navigation */}
        <Tabs 
          defaultValue="overview" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="mb-8"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-auto">
            <TabsTrigger value="overview" className="py-2">
              {isHindi ? 'परिचय' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="features" className="py-2">
              {isHindi ? 'सुविधाएँ' : 'Features'}
            </TabsTrigger>
            <TabsTrigger value="guide" className="py-2">
              {isHindi ? 'उपयोग गाइड' : 'User Guide'}
            </TabsTrigger>
            <TabsTrigger value="faq" className="py-2">
              {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'FAQ'}
            </TabsTrigger>
            <TabsTrigger value="contact" className="py-2">
              {isHindi ? 'संपर्क करें' : 'Contact'}
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 rounded-lg border border-purple-100 dark:border-purple-800">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-purple-800 dark:text-purple-300">
                  <BookOpen className="h-6 w-6" />
                  {isHindi ? 'स्टडी AI - एक परिचय' : 'Study AI - An Introduction'}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {isHindi 
                    ? 'स्टडी AI एक उन्नत AI-संचालित अध्ययन सहायक है जो विद्यार्थियों को उनकी शैक्षिक यात्रा में मदद करने के लिए डिज़ाइन किया गया है। हमारा AI सहायक छात्रों को किसी भी विषय में प्रश्न पूछने, नोट्स तैयार करने, अध्ययन योजनाएं बनाने, होमवर्क में सहायता प्राप्त करने और परीक्षा की तैयारी करने की अनुमति देता है। हमारा लक्ष्य शिक्षा को अधिक सुलभ, व्यक्तिगत और प्रभावी बनाना है।'
                    : 'Study AI is an advanced AI-powered study assistant designed to help students in their educational journey. Our AI assistant allows students to ask questions on any subject, create notes, generate study plans, get homework assistance, and prepare for exams. Our goal is to make education more accessible, personalized, and effective.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard 
                  icon={<Brain className="h-6 w-6 text-purple-500" />}
                  title={isHindi ? 'स्मार्ट अध्ययन' : 'Smart Learning'}
                  description={isHindi 
                    ? 'AI अनुकूलित अध्ययन अनुभव के साथ अपनी सीखने की क्षमता को बढ़ाएं'
                    : 'Enhance your learning capabilities with AI-tailored study experiences'
                  }
                />
                <FeatureCard 
                  icon={<MessageSquare className="h-6 w-6 text-indigo-500" />}
                  title={isHindi ? 'इंटरएक्टिव चैट' : 'Interactive Chat'}
                  description={isHindi 
                    ? 'हमारे AI के साथ वार्तालाप करें और तुरंत अपने प्रश्नों के उत्तर प्राप्त करें'
                    : 'Converse with our AI and get instant answers to your questions'
                  }
                />
                <FeatureCard 
                  icon={<GraduationCap className="h-6 w-6 text-blue-500" />}
                  title={isHindi ? 'शिक्षक मोड' : 'Teacher Mode'}
                  description={isHindi 
                    ? 'वास्तविक शिक्षकों से जोड़ने और अतिरिक्त मार्गदर्शन प्राप्त करने की सुविधा'
                    : 'Features that connect with real teachers for additional guidance'
                  }
                />
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-6 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <h3 className="text-xl font-semibold mb-3 text-indigo-700 dark:text-indigo-300">
                  {isHindi ? 'हमारा दृष्टिकोण' : 'Our Vision'}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {isHindi 
                    ? 'स्टडी AI का मिशन शिक्षा के क्षेत्र में एक क्रांति लाना है। हम मानते हैं कि हर छात्र अद्वितीय है और सीखने की अपनी गति और शैली के अनुसार शिक्षा प्राप्त करने का अधिकार रखता है। AI की शक्ति का उपयोग करके, हम व्यक्तिगत शिक्षा अनुभव प्रदान करते हैं जो छात्रों की व्यक्तिगत जरूरतों के अनुकूल हैं।'
                    : 'Study AI\'s mission is to revolutionize the field of education. We believe that every student is unique and deserves education according to their own pace and style of learning. By harnessing the power of AI, we provide personalized educational experiences that adapt to students\' individual needs.'}
                </p>
              </div>
            </div>
          </TabsContent>
          
          {/* Features Tab */}
          <TabsContent value="features" className="mt-6 space-y-8">
            <FeatureSection
              icon={<MessageSquare className="h-6 w-6 text-purple-500" />}
              title={isHindi ? 'AI चैट' : 'AI Chat'}
              description={isHindi
                ? 'स्टडी AI के साथ वार्तालाप करें और अपने अध्ययन से संबंधित प्रश्न पूछें। वास्तविक समय में प्रतिक्रिया प्राप्त करें।'
                : 'Converse with Study AI and ask questions related to your studies. Get real-time responses.'}
              features={[
                isHindi ? 'किसी भी विषय पर प्रश्न पूछें' : 'Ask questions on any subject',
                isHindi ? 'जटिल अवधारणाओं के सरल स्पष्टीकरण प्राप्त करें' : 'Get simple explanations of complex concepts',
                isHindi ? 'मैसेज बुकमार्क करें और बाद में देखें' : 'Bookmark messages for later reference',
                isHindi ? 'चैट इतिहास सहेजें और निर्यात करें' : 'Save and export chat history',
                isHindi ? 'अध्ययन सहायता के लिए टेक्स्ट/इमेज अपलोड करें' : 'Upload text/images for study assistance'
              ]}
            />

            <FeatureSection
              icon={<Calendar className="h-6 w-6 text-indigo-500" />}
              title={isHindi ? 'अध्ययन योजनाकार' : 'Study Planner'}
              description={isHindi
                ? 'अपने लक्ष्यों और समय सीमा के अनुसार व्यक्तिगत अध्ययन योजनाएं बनाएं। परीक्षाओं के लिए अच्छी तरह से तैयार रहें।'
                : 'Create personalized study plans according to your goals and deadlines. Stay well-prepared for exams.'}
              features={[
                isHindi ? 'परीक्षा तिथियों के अनुसार अनुकूलित अध्ययन समय-सारणी' : 'Customized study schedules based on exam dates',
                isHindi ? 'विषय और अध्याय-आधारित अध्ययन योजनाएं' : 'Subject and chapter-based study plans',
                isHindi ? 'अध्ययन अनुस्मारक और प्रगति ट्रैकिंग' : 'Study reminders and progress tracking',
                isHindi ? 'आदतों के आधार पर अनुकूलित अध्ययन अवधि' : 'Customized study sessions based on habits',
                isHindi ? 'अध्ययन के लिए स्मार्ट ब्रेक सुझाव' : 'Smart break suggestions for studying'
              ]}
            />

            <FeatureSection
              icon={<FileText className="h-6 w-6 text-blue-500" />}
              title={isHindi ? 'नोट्स जनरेटर' : 'Notes Generator'}
              description={isHindi
                ? 'किसी भी विषय पर संक्षिप्त, व्यापक या परीक्षा-केंद्रित नोट्स तैयार करें। अपनी समझ को बेहतर बनाएं और परीक्षा की तैयारी करें।'
                : 'Generate concise, comprehensive, or exam-focused notes on any subject. Improve your understanding and prepare for exams.'}
              features={[
                isHindi ? 'कई प्रारूपों में नोट्स जनरेशन' : 'Note generation in multiple formats',
                isHindi ? 'वैज्ञानिक, मानविकी, और तकनीकी विषयों के लिए अनुकूलित' : 'Tailored for scientific, humanities, and technical subjects',
                isHindi ? 'आसान समझ के लिए चित्र और आरेख के साथ' : 'With diagrams and illustrations for easy understanding',
                isHindi ? 'नोट्स को साझा करने और निर्यात करने की क्षमता' : 'Ability to share and export notes',
                isHindi ? 'विभिन्न सीखने की शैलियों के लिए अनुकूलित' : 'Adapted for different learning styles'
              ]}
            />

            <FeatureSection
              icon={<BookOpen className="h-6 w-6 text-green-500" />}
              title={isHindi ? 'क्विज़ जनरेटर' : 'Quiz Generator'}
              description={isHindi
                ? 'अपने ज्ञान का परीक्षण करने और अपनी कमजोरियों की पहचान करने के लिए अनुकूलित क्विज़ बनाएं।'
                : 'Create customized quizzes to test your knowledge and identify your weaknesses.'}
              features={[
                isHindi ? 'विभिन्न कठिनाई स्तरों के साथ प्रश्न' : 'Questions with varying difficulty levels',
                isHindi ? 'बहुविकल्पीय, सही-गलत, और लघु उत्तर प्रश्न' : 'Multiple choice, true-false, and short answer questions',
                isHindi ? 'विस्तृत व्याख्याओं के साथ उत्तर' : 'Answers with detailed explanations',
                isHindi ? 'प्रदर्शन विश्लेषण और सुधार सुझाव' : 'Performance analysis and improvement suggestions',
                isHindi ? 'अभ्यास मोड और टाइम्ड परीक्षण' : 'Practice mode and timed tests'
              ]}
            />

            <FeatureSection
              icon={<Calculator className="h-6 w-6 text-yellow-500" />}
              title={isHindi ? 'समस्या समाधानकर्ता' : 'Problem Solver'}
              description={isHindi
                ? 'चरण-दर-चरण समाधान के साथ गणित, विज्ञान, और अन्य विषयों की समस्याओं को हल करें।'
                : 'Solve problems in mathematics, science, and other subjects with step-by-step solutions.'}
              features={[
                isHindi ? 'अलजेब्रा, कैलकुलस, और सांख्यिकी' : 'Algebra, calculus, and statistics',
                isHindi ? 'भौतिकी और रसायन विज्ञान समस्याएं' : 'Physics and chemistry problems',
                isHindi ? 'प्रोग्रामिंग और कोडिंग सहायता' : 'Programming and coding assistance',
                isHindi ? 'डिज़ाइन और इंजीनियरिंग परियोजनाएं' : 'Design and engineering projects',
                isHindi ? 'व्यावसायिक और वित्तीय समस्याएं' : 'Business and financial problems'
              ]}
            />

            <FeatureSection
              icon={<GraduationCap className="h-6 w-6 text-pink-500" />}
              title={isHindi ? 'शिक्षक मोड' : 'Teacher Mode'}
              description={isHindi
                ? 'छात्रों को शिक्षकों से जोड़ें और अतिरिक्त मार्गदर्शन और सहायता प्राप्त करें।'
                : 'Connect students with teachers and get additional guidance and assistance.'}
              features={[
                isHindi ? 'वास्तविक शिक्षकों के साथ चैट' : 'Chat with real teachers',
                isHindi ? 'विशेषज्ञों से प्रश्न पूछें' : 'Ask questions from experts',
                isHindi ? 'असाइनमेंट पर प्रतिक्रिया प्राप्त करें' : 'Get feedback on assignments',
                isHindi ? 'सामूहिक अध्ययन सत्र' : 'Group study sessions',
                isHindi ? 'अतिरिक्त अध्ययन संसाधनों तक पहुंच' : 'Access to additional study resources'
              ]}
            />

            <FeatureSection
              icon={<Clock className="h-6 w-6 text-orange-500" />}
              title={isHindi ? 'अध्ययन टाइमर और फोकस टूल्स' : 'Study Timer & Focus Tools'}
              description={isHindi
                ? 'प्रभावी अध्ययन सत्रों के लिए अपने समय का प्रबंधन करें और फोकस में सुधार करें।'
                : 'Manage your time for effective study sessions and improve focus.'}
              features={[
                isHindi ? 'पोमोडोरो टाइमर' : 'Pomodoro timer',
                isHindi ? 'ब्रेक अनुस्मारक' : 'Break reminders',
                isHindi ? 'ध्यान बढ़ाने वाले अभ्यास' : 'Focus-enhancing exercises',
                isHindi ? 'लक्ष्य सेटिंग और ट्रैकिंग' : 'Goal setting and tracking',
                isHindi ? 'अध्ययन सत्र विश्लेषण' : 'Study session analytics'
              ]}
            />

            <FeatureSection
              icon={<BookOpenCheck className="h-6 w-6 text-purple-500" />}
              title={isHindi ? 'याददाश्त बढ़ाने वाले उपकरण' : 'Memory Enhancement Tools'}
              description={isHindi
                ? 'अपनी याददाश्त में सुधार करने और बेहतर स्मरण के लिए उपकरणों और तकनीकों का उपयोग करें।'
                : 'Use tools and techniques to improve your memory and recall.'}
              features={[
                isHindi ? 'फ्लैशकार्ड जनरेटर' : 'Flashcard generator',
                isHindi ? 'स्पेस्ड रिपिटिशन सिस्टम' : 'Spaced repetition system',
                isHindi ? 'स्मरणीय संकेत और एसोसिएशन' : 'Mnemonic devices and associations',
                isHindi ? 'विज़ुअलाइजेशन तकनीक' : 'Visualization techniques',
                isHindi ? 'अध्ययन के लिए माइंड मैपिंग' : 'Mind mapping for studying'
              ]}
            />
          </TabsContent>
          
          {/* User Guide Tab */}
          <TabsContent value="guide" className="mt-6 space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-300">
                {isHindi ? 'शुरू करें' : 'Getting Started'}
              </h2>
              
              <GuideSection 
                title={isHindi ? 'खाता बनाना' : 'Creating an Account'}
                steps={[
                  isHindi 
                    ? 'होमपेज पर "साइन अप" बटन पर क्लिक करें।' 
                    : 'Click on the "Sign Up" button on the homepage.',
                  isHindi 
                    ? 'अपना नाम, ईमेल और पासवर्ड दर्ज करें।' 
                    : 'Enter your name, email, and password.',
                  isHindi 
                    ? 'अपने खाते को सत्यापित करने के लिए अपने ईमेल पर भेजे गए लिंक पर क्लिक करें।' 
                    : 'Click on the link sent to your email to verify your account.',
                  isHindi 
                    ? 'अपनी शिक्षा स्तर और अध्ययन क्षेत्रों के बारे में जानकारी भरें।' 
                    : 'Fill in information about your education level and study areas.'
                ]}
              />
              
              <GuideSection 
                title={isHindi ? 'लॉग इन करना' : 'Logging In'}
                steps={[
                  isHindi 
                    ? 'होमपेज पर "लॉग इन" बटन पर क्लिक करें।' 
                    : 'Click on the "Log In" button on the homepage.',
                  isHindi 
                    ? 'अपना ईमेल और पासवर्ड दर्ज करें।' 
                    : 'Enter your email and password.',
                  isHindi 
                    ? '"लॉग इन" पर क्लिक करें।' 
                    : 'Click on "Log In".',
                  isHindi 
                    ? 'अपने अध्ययन डैशबोर्ड पर पहुंचें।' 
                    : 'Access your study dashboard.'
                ]}
              />
              
              <GuideSection 
                title={isHindi ? 'पासवर्ड रीसेट करना' : 'Resetting Password'}
                steps={[
                  isHindi 
                    ? 'लॉगिन पेज पर "पासवर्ड भूल गए?" लिंक पर क्लिक करें।' 
                    : 'Click on "Forgot Password?" link on the login page.',
                  isHindi 
                    ? 'अपना पंजीकृत ईमेल पता दर्ज करें।' 
                    : 'Enter your registered email address.',
                  isHindi 
                    ? '"रीसेट लिंक भेजें" पर क्लिक करें।' 
                    : 'Click on "Send Reset Link".',
                  isHindi 
                    ? 'अपने ईमेल पर भेजे गए लिंक पर क्लिक करें।' 
                    : 'Click on the link sent to your email.',
                  isHindi 
                    ? 'अपना नया पासवर्ड सेट करें और अपने खाते में लॉग इन करें।' 
                    : 'Set your new password and log into your account.'
                ]}
              />
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-lg border border-purple-100 dark:border-purple-800">
              <h2 className="text-2xl font-semibold mb-4 text-purple-700 dark:text-purple-300">
                {isHindi ? 'प्रमुख सुविधाओं का उपयोग' : 'Using Key Features'}
              </h2>
              
              <GuideSection 
                title={isHindi ? 'AI चैट का उपयोग' : 'Using AI Chat'}
                steps={[
                  isHindi 
                    ? 'होम स्क्रीन पर दिए गए चैट इनपुट पर क्लिक करें।' 
                    : 'Click on the chat input provided on the home screen.',
                  isHindi 
                    ? 'अपना प्रश्न टाइप करें और एंटर दबाएं।' 
                    : 'Type your question and press enter.',
                  isHindi 
                    ? 'अपना संदेश संपादित करने या हटाने के लिए संदेश पर राइट-क्लिक करें।' 
                    : 'Right-click on a message to edit or delete it.',
                  isHindi 
                    ? 'महत्वपूर्ण जानकारी को सहेजने के लिए संदेश को बुकमार्क करें।' 
                    : 'Bookmark messages to save important information.',
                  isHindi 
                    ? 'चैट इतिहास देखने के लिए साइडबार में "इतिहास" पर क्लिक करें।' 
                    : 'Click on "History" in the sidebar to view chat history.'
                ]}
              />
              
              <GuideSection 
                title={isHindi ? 'नोट्स या अध्ययन योजना बनाना' : 'Creating Notes or Study Plan'}
                steps={[
                  isHindi 
                    ? '"स्टडी फीचर्स" टैब पर जाएं और "स्मार्ट नोट्स" या "अध्ययन योजना" पर क्लिक करें।' 
                    : 'Go to the "Study Features" tab and click on "Smart Notes" or "Study Plan".',
                  isHindi 
                    ? 'विषय, अध्याय, या परीक्षा विवरण दर्ज करें।' 
                    : 'Enter the subject, chapter, or exam details.',
                  isHindi 
                    ? '"जनरेट करें" बटन पर क्लिक करें।' 
                    : 'Click on the "Generate" button.',
                  isHindi 
                    ? 'नोट्स या अध्ययन योजना को संपादित, सहेजें या साझा करें।' 
                    : 'Edit, save, or share the notes or study plan.',
                  isHindi 
                    ? 'नोट्स देखने के लिए "सहेजे गए" सेक्शन पर जाएं।' 
                    : 'Go to the "Saved" section to view your notes.'
                ]}
              />
              
              <GuideSection 
                title={isHindi ? 'शिक्षक से संपर्क करना' : 'Contacting a Teacher'}
                steps={[
                  isHindi 
                    ? 'साइडबार में "शिक्षक से पूछें" पर क्लिक करें।' 
                    : 'Click on "Ask Teacher" in the sidebar.',
                  isHindi 
                    ? 'विषय और अपना प्रश्न दर्ज करें।' 
                    : 'Enter the subject and your question.',
                  isHindi 
                    ? 'वैकल्पिक रूप से अपने प्रश्न से संबंधित फ़ाइलें अपलोड करें।' 
                    : 'Optionally upload files related to your question.',
                  isHindi 
                    ? '"भेजें" बटन पर क्लिक करें।' 
                    : 'Click on the "Send" button.',
                  isHindi 
                    ? 'शिक्षक का जवाब आने पर आपको एक सूचना मिलेगी।' 
                    : 'You will get a notification when the teacher responds.'
                ]}
              />
              
              <GuideSection 
                title={isHindi ? 'अध्ययन टाइमर का उपयोग' : 'Using Study Timer'}
                steps={[
                  isHindi 
                    ? 'होम स्क्रीन पर "अध्ययन टाइमर" बटन पर क्लिक करें।' 
                    : 'Click on "Study Timer" button on the home screen.',
                  isHindi 
                    ? 'अध्ययन और ब्रेक की अवधि सेट करें।' 
                    : 'Set the study and break duration.',
                  isHindi 
                    ? '"शुरू करें" बटन पर क्लिक करके अध्ययन सत्र शुरू करें।' 
                    : 'Click on "Start" button to begin your study session.',
                  isHindi 
                    ? 'टाइमर समाप्त होने के बाद ब्रेक लें।' 
                    : 'Take a break when the timer ends.',
                  isHindi 
                    ? 'अध्ययन सत्र पूरा होने पर, अपनी प्रगति देखें और XP अंक प्राप्त करें।' 
                    : 'When the study session is complete, view your progress and earn XP points.'
                ]}
              />
            </div>
          </TabsContent>
          
          {/* FAQ Tab */}
          <TabsContent value="faq" className="mt-6 space-y-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
              </h2>
              
              <div className="space-y-4">
                <FaqItem 
                  question={isHindi ? 'क्या स्टडी AI का उपयोग मुफ्त है?' : 'Is Study AI free to use?'}
                  answer={isHindi 
                    ? 'स्टडी AI के बुनियादी फीचर्स मुफ्त हैं। हालांकि, अतिरिक्त उन्नत सुविधाओं के लिए प्रीमियम सदस्यता उपलब्ध है।' 
                    : 'Basic features of Study AI are free. However, premium subscriptions are available for additional advanced features.'}
                />
                
                <FaqItem 
                  question={isHindi ? 'क्या मैं अपने डिवाइस पर स्टडी AI का उपयोग कर सकता हूँ?' : 'Can I use Study AI on my device?'}
                  answer={isHindi 
                    ? 'हां, स्टडी AI वेब-आधारित है और किसी भी डिवाइस (मोबाइल, टैबलेट, लैपटॉप) पर वेब ब्राउज़र के माध्यम से एक्सेस किया जा सकता है।' 
                    : 'Yes, Study AI is web-based and can be accessed through a web browser on any device (mobile, tablet, laptop).'}
                />
                
                <FaqItem 
                  question={isHindi ? 'क्या मैं अपने अध्ययन सामग्री को सहेज सकता हूँ और बाद में एक्सेस कर सकता हूँ?' : 'Can I save my study materials and access them later?'}
                  answer={isHindi 
                    ? 'हां, आप अपनी सभी नोट्स, अध्ययन योजनाएं, और महत्वपूर्ण चैट सहेज सकते हैं और अपने खाते से कभी भी एक्सेस कर सकते हैं।' 
                    : 'Yes, you can save all your notes, study plans, and important chats and access them anytime from your account.'}
                />
                
                <FaqItem 
                  question={isHindi ? 'स्टडी AI कितनी भाषाओं का समर्थन करता है?' : 'How many languages does Study AI support?'}
                  answer={isHindi 
                    ? 'स्टडी AI वर्तमान में अंग्रेजी और हिंदी का समर्थन करता है। भविष्य में अधिक भाषाएँ जोड़ी जाएंगी।' 
                    : 'Study AI currently supports English and Hindi. More languages will be added in the future.'}
                />
                
                <FaqItem 
                  question={isHindi ? 'क्या मैं अपने अध्ययन की प्रगति को ट्रैक कर सकता हूँ?' : 'Can I track my study progress?'}
                  answer={isHindi 
                    ? 'हां, स्टडी AI आपके अध्ययन सत्रों, लक्ष्य पूर्णता, और सीखने की प्रगति को ट्रैक करता है और विश्लेषण प्रदान करता है।' 
                    : 'Yes, Study AI tracks your study sessions, goal completions, and learning progress, providing analytics.'}
                />
                
                <FaqItem 
                  question={isHindi ? 'क्या मुझे अपने खाते में लॉग इन करना होगा?' : 'Do I need to be logged in to my account?'}
                  answer={isHindi 
                    ? 'कुछ बुनियादी सुविधाओं का उपयोग लॉगिन के बिना किया जा सकता है, लेकिन व्यक्तिगत अनुभव और सहेजने के लिए लॉग इन की आवश्यकता होती है।' 
                    : 'Some basic features can be used without logging in, but personalized experience and saving features require login.'}
                />
                
                <FaqItem 
                  question={isHindi ? 'क्या स्टडी AI सभी शैक्षिक स्तरों के लिए उपयुक्त है?' : 'Is Study AI suitable for all academic levels?'}
                  answer={isHindi 
                    ? 'हां, स्टडी AI प्राथमिक स्कूल से लेकर विश्वविद्यालय और व्यावसायिक शिक्षा तक सभी स्तरों के छात्रों के लिए डिज़ाइन किया गया है।' 
                    : 'Yes, Study AI is designed for students of all levels from primary school to university and professional education.'}
                />
                
                <FaqItem 
                  question={isHindi ? 'क्या मैं शिक्षक मोड में वास्तविक शिक्षकों से बातचीत कर सकता हूँ?' : 'Can I interact with real teachers in Teacher Mode?'}
                  answer={isHindi 
                    ? 'हां, शिक्षक मोड आपको प्रमाणित शिक्षकों और विषय विशेषज्ञों से जोड़ता है जो आपके प्रश्नों और असाइनमेंट में मदद कर सकते हैं।' 
                    : 'Yes, Teacher Mode connects you with certified teachers and subject experts who can help with your questions and assignments.'}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Contact Tab */}
          <TabsContent value="contact" className="mt-6">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 p-6 rounded-lg border border-purple-100 dark:border-purple-800">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-purple-800 dark:text-purple-300">
                <Phone className="h-5 w-5" />
                {isHindi ? 'संपर्क जानकारी' : 'Contact Information'}
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-purple-100 dark:border-purple-900">
                  <h3 className="text-xl font-bold mb-3 text-purple-700 dark:text-purple-300">
                    {isHindi ? 'निर्माता' : 'Created By'}
                  </h3>
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
                      AK
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Ajit Kumar
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {isHindi ? 'शिक्षा प्रौद्योगिकी विशेषज्ञ & प्रोग्रामर' : 'EdTech Specialist & Programmer'}
                      </p>
                      <p className="mt-2 text-purple-600 dark:text-purple-400 font-medium">
                        {isHindi ? 'मोबाइल:' : 'Mobile:'} 9504797910
                      </p>
                      <p className="text-purple-600 dark:text-purple-400 font-medium">
                        {isHindi ? 'ईमेल:' : 'Email:'} ajit91884270@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-purple-100 dark:border-purple-900">
                    <h3 className="text-lg font-medium mb-3 text-purple-700 dark:text-purple-300 flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      {isHindi ? 'सहायता और समर्थन' : 'Help & Support'}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {isHindi 
                        ? 'किसी भी प्रश्न या सहायता के लिए, हमें ईमेल करें:' 
                        : 'For any questions or assistance, email us at:'}
                    </p>
                    <p className="mt-2 font-medium text-purple-600 dark:text-purple-400">
                      support@studyai.com
                    </p>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {isHindi 
                        ? 'हम आमतौर पर 24 घंटे के भीतर जवाब देते हैं।' 
                        : 'We typically respond within 24 hours.'}
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-purple-100 dark:border-purple-900">
                    <h3 className="text-lg font-medium mb-3 text-purple-700 dark:text-purple-300 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      {isHindi ? 'प्रतिक्रिया दें' : 'Give Feedback'}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {isHindi 
                        ? 'हमें अपनी प्रतिक्रिया दें और हमें अपना अनुभव बेहतर बनाने में मदद करें:' 
                        : 'Share your feedback and help us improve your experience:'}
                    </p>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {isHindi 
                        ? 'साइडबार में "प्रतिक्रिया दें" बटन पर क्लिक करें।' 
                        : 'Click on "Give Feedback" button in the sidebar.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

// Helper Components

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="font-semibold text-lg mb-1">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 text-sm">{description}</p>
  </div>
);

const FeatureSection = ({ 
  icon, 
  title, 
  description, 
  features 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string, 
  features: string[] 
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <div className="flex items-center justify-center shrink-0">
        <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <div className="grid md:grid-cols-2 gap-x-4 gap-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const GuideSection = ({ title, steps }: { title: string, steps: string[] }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <ol className="space-y-2 ml-5 text-gray-700 dark:text-gray-300">
      {steps.map((step, index) => (
        <li key={index} className="list-decimal">
          {step}
        </li>
      ))}
    </ol>
  </div>
);

const FaqItem = ({ question, answer }: { question: string, answer: string }) => (
  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
    <h3 className="font-semibold text-lg mb-2 text-purple-700 dark:text-purple-300">{question}</h3>
    <p className="text-gray-700 dark:text-gray-300">{answer}</p>
  </div>
);

export default About;
