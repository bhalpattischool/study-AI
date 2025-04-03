
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { toast } from 'sonner';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { TeacherFormValues, TeacherModeProps } from './teacher/types';

// Import sub-components
import StudentNameField from './teacher/StudentNameField';
import SubjectFields from './teacher/SubjectFields';
import AudioControls from './teacher/AudioControls';
import TeachingStyleRadio from './teacher/TeachingStyleRadio';
import CategoryRadio from './teacher/CategoryRadio';
import ActionRadio from './teacher/ActionRadio';
import SubmitButton from './teacher/SubmitButton';
import StudentQuestion from './teacher/StudentQuestion';

const TeacherMode: React.FC<TeacherModeProps> = ({ onSendMessage }) => {
  const { t, language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customSubject, setCustomSubject] = useState(false);
  const [useVoiceResponse, setUseVoiceResponse] = useState(true);
  const { isTTSEnabled, toggleTTS } = useTextToSpeech();
  const { isListening, toggleListening } = useSpeechRecognition(language);
  
  const form = useForm<TeacherFormValues>({
    defaultValues: {
      subject: '',
      customSubjectText: '',
      chapter: '',
      studentName: '',
      teachingStyle: 'teacher',
      category: 'concise',
      action: 'read',
      voiceInteraction: 'enabled'
    }
  });

  const handleSubjectChange = (value: string) => {
    form.setValue('subject', value);
    setCustomSubject(value === 'custom');
  };

  const sendStudentQuestion = () => {
    const questionField = document.getElementById('student-question') as HTMLInputElement;
    if (questionField && questionField.value.trim()) {
      // Get student name
      const studentName = form.getValues('studentName') || t('studentName');
      
      // Format a follow-up question with classroom-like language
      const question = language === 'hi' 
        ? `मैं ${studentName} हूँ और मुझे आपसे एक सवाल पूछना है: "${questionField.value.trim()}" कृपया मुझे एक असली शिक्षक की तरह जवाब दें, जैसे कि हम एक असली कक्षा में हैं।`
        : `Teacher, this is ${studentName} raising my hand with a question: "${questionField.value.trim()}" Please explain it to me as if we're in a real classroom.`;
      
      // Add voice response instruction if enabled
      const voiceInstruction = useVoiceResponse
        ? (language === 'hi' 
          ? ' कृपया बिल्कुल वैसे ही जवाब दें जैसे आप कक्षा में खड़े होकर सीधे मुझसे बात कर रहे हैं। ऐसा लगना चाहिए कि आप एक असली शिक्षक हैं।' 
          : ' Please respond exactly as you would if you were standing in a classroom speaking directly to me. Sound like a real teacher addressing their student.')
        : '';
      
      onSendMessage(question + voiceInstruction);
      questionField.value = '';
      
      // Show teacher acknowledgment toast
      toast.success(language === 'hi' 
        ? 'शिक्षक आपका प्रश्न देख रहे हैं...' 
        : 'Teacher is looking at your question...', 
        { duration: 2000 }
      );
    } else {
      toast.error(language === 'hi' ? 'कृपया एक प्रश्न दर्ज करें' : 'Please enter a question');
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    setIsProcessing(true);
    
    const selectedSubject = customSubject ? data.customSubjectText : data.subject;
    
    const teachingStyle = data.teachingStyle === 'teacher' 
      ? (language === 'hi' 
        ? `इसे बिल्कुल वैसे ही पढ़ाएं जैसे एक असली शिक्षक कक्षा में पढ़ाते हैं, जो मुझे सीधे "${data.studentName || t('studentName')}" के नाम से संबोधित करते हैं। हर थोड़ी देर में मुझसे सवाल पूछते हैं, उत्साहित आवाज में बोलते हैं, और छात्र की समझ सुनिश्चित करने के लिए उदाहरण और दृश्यों का उपयोग करते हैं।`
        : `Teach this exactly like a passionate classroom teacher would, addressing me directly as "${data.studentName || t('studentName')}" throughout the lesson. Ask me questions periodically, speak with an enthusiastic voice, and use examples and visuals to ensure student understanding.`)
      : (language === 'hi'
        ? 'मानक शैक्षणिक शैली में जानकारी प्रदान करें'
        : 'Provide information in standard educational format');
      
    const category = data.category === 'concise'
      ? (language === 'hi'
        ? 'इसे संक्षिप्त रखें और मुख्य बिंदुओं पर प्रकाश डालें, लेकिन फिर भी शिक्षक की तरह समझाएं'
        : 'Keep it concise and highlight the main points, but still explain like a teacher')
      : (language === 'hi'
        ? 'पूरी जानकारी के साथ विस्तृत व्याख्या दें, जैसे एक पूरा पाठ है'
        : 'Give a detailed explanation with complete information, like a full lesson');
      
    const action = data.action === 'notes'
      ? (language === 'hi'
        ? 'अध्ययन नोट्स तैयार करें, लेकिन इन्हें एक शिक्षक द्वारा बोर्ड पर लिखे गए नोट्स के रूप में प्रस्तुत करें'
        : 'Generate study notes but present them as if a teacher is writing them on a board and explaining each point')
      : (language === 'hi'
        ? 'विषय को रोचक पाठ के रूप में समझाएं, जैसे कि हम कक्षा में हैं'
        : 'Explain the content as an engaging lesson, as if we are in a classroom');
    
    const voiceResponseRequest = useVoiceResponse
      ? (language === 'hi'
        ? '\n\nमैं आपके उत्तर को आवाज में सुनूंगा, इसलिए कृपया ऐसे शब्दों का प्रयोग करें जो बोलने पर प्राकृतिक लगें। वाक्य छोटे रखें और ऐसे बोलें जैसे आप सीधे कक्षा में खड़े होकर पढ़ा रहे हों।'
        : '\n\nI will be listening to your response, so please use words that sound natural when spoken. Keep sentences short and speak as if you are teaching directly in a classroom.')
      : '';
    
    let prompt = '';
    
    if (language === 'hi') {
      prompt = `एक वास्तविक कक्षा शिक्षक के रूप में कार्य करें ${data.teachingStyle === 'teacher' ? 'जो बहुत उत्साही, प्रभावशाली और प्रेरणादायक हैं' : 'मानक शिक्षण मोड में'।}
विषय: ${selectedSubject}
अध्याय: ${data.chapter}
विद्यार्थी का नाम: ${data.studentName || t('studentName')}
शिक्षण शैली: ${teachingStyle}
विवरण स्तर: ${category}
कार्रवाई: ${action}

${data.teachingStyle === 'teacher' ? `मुझे एकदम सीधे "${data.studentName || t('studentName')}" के रूप में संबोधित करें, असली शिक्षक की तरह बात करें, समझ सुनिश्चित करने के लिए बीच-बीच में प्रश्न पूछें, और ऐसे पढ़ाएं जैसे हम एक असली कक्षा में हैं। कृपया पाठ को बहुत रोचक, संवादात्मक और सरल भाषा में प्रस्तुत करें जैसे कि आप वास्तव में कक्षा में बोल रहे हों। प्रत्येक अवधारणा को समझाते समय उत्साह दिखाएं और प्रोत्साहन के शब्दों का प्रयोग करें।` : ''}${voiceResponseRequest}`;
    } else {
      prompt = `Act as a real classroom teacher ${data.teachingStyle === 'teacher' ? 'who is very enthusiastic, impactful, and inspirational' : 'in standard teaching mode'}. 
Subject: ${selectedSubject}
Chapter: ${data.chapter}
Student Name: ${data.studentName || t('studentName')}
Teaching Style: ${teachingStyle}
Detail Level: ${category}
Action: ${action}

${data.teachingStyle === 'teacher' ? `Address me directly as "${data.studentName || t('studentName')}" throughout, talk like a real teacher would, ask questions periodically to ensure understanding, and teach as if we're in an actual classroom. Please present the lesson in a very engaging, conversational, and simple language as if you're actually speaking in a classroom. Show enthusiasm when explaining each concept and use words of encouragement.` : ''}${voiceResponseRequest}`;
    }
    
    onSendMessage(prompt);
    setIsProcessing(false);
    
    // Show teacher confirmation
    toast.success(language === 'hi' 
      ? 'शिक्षक आपका पाठ तैयार कर रहे हैं...' 
      : 'Teacher is preparing your lesson...', 
      { duration: 3000 }
    );
  });

  return (
    <Card className="border border-purple-100 dark:border-purple-800">
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-medium mb-2">
            <GraduationCap className="h-5 w-5" />
            <h3 className="text-lg font-semibold">{t('teacherMode')}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {language === 'hi' 
              ? 'एक असली शिक्षक से जैसे आप कक्षा में हों वैसे ही पढ़ाई करें'
              : t('teacherModeDescription')}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <StudentNameField form={form} />

            <SubjectFields 
              form={form} 
              customSubject={customSubject} 
              onSubjectChange={handleSubjectChange} 
            />

            <AudioControls 
              isTTSEnabled={isTTSEnabled} 
              useVoiceResponse={useVoiceResponse} 
              toggleTTS={toggleTTS} 
              setUseVoiceResponse={setUseVoiceResponse} 
            />

            <TeachingStyleRadio form={form} />
            <CategoryRadio form={form} />
            <ActionRadio form={form} />

            <SubmitButton isProcessing={isProcessing} />
          </form>
        </Form>

        <StudentQuestion 
          isListening={isListening} 
          toggleListening={() => toggleListening('student-question')} 
          sendStudentQuestion={sendStudentQuestion} 
        />
      </CardContent>
    </Card>
  );
};

export default TeacherMode;
