
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
      
      // Format a follow-up question
      const question = language === 'hi' 
        ? `मुझे ${studentName} नाम के छात्र का एक प्रश्न है: "${questionField.value.trim()}"`
        : `I am student ${studentName} and I have a question: "${questionField.value.trim()}"`;
      
      // Add voice response instruction if enabled
      const voiceInstruction = useVoiceResponse
        ? (language === 'hi' ? ' कृपया ऐसे जवाब दें जैसे आप एक असली शिक्षक हैं जो सीधे मुझसे बात कर रहे हैं।' : ' Please respond as if you are a real teacher speaking directly to me.')
        : '';
      
      onSendMessage(question + voiceInstruction);
      questionField.value = '';
    } else {
      toast.error(language === 'hi' ? 'कृपया एक प्रश्न दर्ज करें' : 'Please enter a question');
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    setIsProcessing(true);
    
    const selectedSubject = customSubject ? data.customSubjectText : data.subject;
    
    const teachingStyle = data.teachingStyle === 'teacher' 
      ? (language === 'hi' 
        ? `इसे एक वास्तविक शिक्षक की तरह पढ़ाएं जो मुझे सीधे "${data.studentName || t('studentName')}" के रूप में संबोधित करे`
        : `Teach this like a real teacher who addresses me directly as "${data.studentName || t('studentName')}"`)
      : (language === 'hi'
        ? 'मानक टेक्स्ट-आधारित सामग्री प्रदान करें'
        : 'Provide standard text-based content');
      
    const category = data.category === 'concise'
      ? (language === 'hi'
        ? 'इसे संक्षिप्त रखें और मुख्य बिंदुओं पर प्रकाश डालें'
        : 'Keep it concise and highlight the main points')
      : (language === 'hi'
        ? 'पूरी जानकारी के साथ विस्तृत व्याख्या दें'
        : 'Give a detailed explanation with complete information');
      
    const action = data.action === 'notes'
      ? (language === 'hi'
        ? 'अध्ययन नोट्स तैयार करें जिन्हें मैं उपयोग कर सकूं'
        : 'Generate study notes that I can use')
      : (language === 'hi'
        ? 'समझने के लिए सामग्री की व्याख्या करें'
        : 'Explain the content for understanding');
    
    const voiceResponseRequest = useVoiceResponse
      ? (language === 'hi'
        ? '\n\nइस उत्तर का उपयोग मैं वास्तविक अध्यापक से मिली आवाज़ के रूप में कर सकता हूँ, इसलिए कृपया ऐसा लिखें जैसे आप सीधे मुझसे बात कर रहे हैं।'
        : '\n\nThis response will be converted to speech, so please write in a conversational tone as if you are speaking directly to me.')
      : '';
    
    let prompt = '';
    
    if (language === 'hi') {
      prompt = `एक पेशेवर शिक्षक के रूप में कार्य करें ${data.teachingStyle === 'teacher' ? 'इंटरैक्टिव शिक्षण मोड' : 'मानक शिक्षण मोड'} में।
विषय: ${selectedSubject}
अध्याय: ${data.chapter}
विद्यार्थी का नाम: ${data.studentName || t('studentName')}
दृष्टिकोण: ${teachingStyle}
विवरण स्तर: ${category}
कार्रवाई: ${action}

${data.teachingStyle === 'teacher' ? `मुझे सीधे "${data.studentName || t('studentName')}" के रूप में संबोधित करें, समझ सुनिश्चित करने के लिए कभी-कभी प्रश्न पूछें, और इस तरह से पढ़ाएं जो एक लाइव कक्षा अनुभव जैसा लगे। कृपया पाठ को रोचक, संवादात्मक और सरल भाषा में प्रस्तुत करें जैसे कि आप वास्तव में एक कक्षा में बोल रहे हों।` : ''}${voiceResponseRequest}`;
    } else {
      prompt = `Act as a professional teacher in ${data.teachingStyle === 'teacher' ? 'interactive teaching mode' : 'standard teaching mode'}. 
Subject: ${selectedSubject}
Chapter: ${data.chapter}
Student Name: ${data.studentName || t('studentName')}
Approach: ${teachingStyle}
Detail Level: ${category}
Action: ${action}

${data.teachingStyle === 'teacher' ? `Address me directly as "${data.studentName || t('studentName')}", ask questions occasionally to ensure understanding, and teach in a way that feels like a live classroom experience. Please present the lesson in an engaging, conversational, and simple language as if you're actually speaking in a classroom.` : ''}${voiceResponseRequest}`;
    }
    
    onSendMessage(prompt);
    setIsProcessing(false);
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
            {t('teacherModeDescription')}
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
