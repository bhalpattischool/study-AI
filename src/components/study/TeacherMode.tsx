
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { GraduationCap, Mic, MicOff, Volume2, VolumeX, Headphones, MessageSquare, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { toast } from 'sonner';

interface TeacherModeProps {
  onSendMessage: (message: string) => void;
}

const TeacherMode: React.FC<TeacherModeProps> = ({ onSendMessage }) => {
  const { t, language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customSubject, setCustomSubject] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [useVoiceResponse, setUseVoiceResponse] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { isTTSEnabled, toggleTTS, isSpeaking, handleTextToSpeech, stopSpeaking } = useTextToSpeech();
  
  const form = useForm({
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

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        const questionField = document.getElementById('student-question') as HTMLInputElement;
        if (questionField) {
          questionField.value = currentTranscript;
        }
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast.error(language === 'hi' ? 'वाक् पहचान विफल हो गई। कृपया पुनः प्रयास करें।' : 'Speech recognition failed. Please try again.');
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);
  
  // Update recognition language when app language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error(language === 'hi' ? 'आपके ब्राउज़र में वाक् पहचान समर्थित नहीं है' : 'Speech recognition is not supported in your browser');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.success(language === 'hi' ? 'सुन रहा है... अब बोलें' : 'Listening... Speak now');
    }
  };

  const subjects = [
    { value: 'mathematics', label: t('mathematics') },
    { value: 'physics', label: t('physics') },
    { value: 'chemistry', label: t('chemistry') },
    { value: 'biology', label: t('biology') },
    { value: 'history', label: t('history') },
    { value: 'geography', label: t('geography') },
    { value: 'computerScience', label: t('computerScience') },
    { value: 'literature', label: t('literature') },
    { value: 'economics', label: t('economics') },
    { value: 'psychology', label: t('psychology') },
    { value: 'sociology', label: t('sociology') },
    { value: 'custom', label: t('customSubject') },
  ];

  const handleSubjectChange = (value: string) => {
    form.setValue('subject', value);
    setCustomSubject(value === 'custom');
  };

  const sendStudentQuestion = () => {
    const questionField = document.getElementById('student-question') as HTMLInputElement;
    if (questionField && questionField.value.trim()) {
      // Stop listening if active
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
      
      // Get student name
      const studentName = form.getValues('studentName') || t('student');
      
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
        ? `इसे एक वास्तविक शिक्षक की तरह पढ़ाएं जो मुझे सीधे "${data.studentName || 'विद्यार्थी'}" के रूप में संबोधित करे`
        : `Teach this like a real teacher who addresses me directly as "${data.studentName || 'student'}"`)
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
विद्यार्थी का नाम: ${data.studentName || 'विद्यार्थी'}
दृष्टिकोण: ${teachingStyle}
विवरण स्तर: ${category}
कार्रवाई: ${action}

${data.teachingStyle === 'teacher' ? `मुझे सीधे "${data.studentName || 'विद्यार्थी'}" के रूप में संबोधित करें, समझ सुनिश्चित करने के लिए कभी-कभी प्रश्न पूछें, और इस तरह से पढ़ाएं जो एक लाइव कक्षा अनुभव जैसा लगे। कृपया पाठ को रोचक, संवादात्मक और सरल भाषा में प्रस्तुत करें जैसे कि आप वास्तव में एक कक्षा में बोल रहे हों।` : ''}${voiceResponseRequest}`;
    } else {
      prompt = `Act as a professional teacher in ${data.teachingStyle === 'teacher' ? 'interactive teaching mode' : 'standard teaching mode'}. 
Subject: ${selectedSubject}
Chapter: ${data.chapter}
Student Name: ${data.studentName || 'Student'}
Approach: ${teachingStyle}
Detail Level: ${category}
Action: ${action}

${data.teachingStyle === 'teacher' ? `Address me directly as "${data.studentName || 'Student'}", ask questions occasionally to ensure understanding, and teach in a way that feels like a live classroom experience. Please present the lesson in an engaging, conversational, and simple language as if you're actually speaking in a classroom.` : ''}${voiceResponseRequest}`;
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
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('studentName')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('enterStudentName')} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('subject')}</FormLabel>
                    <Select 
                      onValueChange={handleSubjectChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectSubject')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.value} value={subject.value}>
                            {subject.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {customSubject && (
                <FormField
                  control={form.control}
                  name="customSubjectText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('customSubject')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('enterCustomSubject')} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="chapter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('chapter')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('enterChapter')} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleTTS}
                  className={`${isTTSEnabled ? 'bg-purple-100 dark:bg-purple-900' : ''}`}
                >
                  {isTTSEnabled ? (
                    <><Volume2 size={16} className="mr-1" /> {language === 'hi' ? 'आवाज़ चालू' : 'Voice On'}</>
                  ) : (
                    <><VolumeX size={16} className="mr-1" /> {language === 'hi' ? 'आवाज़ बंद' : 'Voice Off'}</>
                  )}
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setUseVoiceResponse(!useVoiceResponse)}
                  className={`${useVoiceResponse ? 'bg-purple-100 dark:bg-purple-900' : ''}`}
                >
                  {useVoiceResponse ? (
                    <><Headphones size={16} className="mr-1" /> {language === 'hi' ? 'आवाज़ जवाब चालू' : 'Voice Response On'}</>
                  ) : (
                    <><BookOpen size={16} className="mr-1" /> {language === 'hi' ? 'आवाज़ जवाब बंद' : 'Voice Response Off'}</>
                  )}
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="teachingStyle"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>{t('teachingStyle')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="teacher" id="teacher" />
                        <Label htmlFor="teacher" className="font-normal cursor-pointer">{t('teacherStyleInteractive')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="font-normal cursor-pointer">{t('teacherStyleStandard')}</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>{t('category')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="concise" id="concise" />
                        <Label htmlFor="concise" className="font-normal cursor-pointer">{t('categoryConcise')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="detailed" id="detailed" />
                        <Label htmlFor="detailed" className="font-normal cursor-pointer">{t('categoryDetailed')}</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>{t('action')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="notes" id="notes" />
                        <Label htmlFor="notes" className="font-normal cursor-pointer">{t('actionNotes')}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="read" id="read" />
                        <Label htmlFor="read" className="font-normal cursor-pointer">{t('actionRead')}</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                  {t('processing')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  {t('generateTeaching')}
                </span>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 border-t border-purple-100 dark:border-purple-800 pt-4">
          <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
            {language === 'hi' ? 'छात्र प्रश्नोत्तरी' : 'Student Questions'}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {language === 'hi' ? 'अपना प्रश्न पूछें जैसे आप कक्षा में हैं' : 'Ask your question as if you are in class'}
          </p>
          
          <div className="flex gap-2">
            <Input
              id="student-question"
              placeholder={language === 'hi' ? "आपका प्रश्न यहां टाइप करें या बोलें..." : "Type or speak your question here..."}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={toggleListening}
              className={`${isListening ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 animate-pulse' : ''}`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </Button>
            <Button
              type="button"
              onClick={sendStudentQuestion}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <MessageSquare size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherMode;
