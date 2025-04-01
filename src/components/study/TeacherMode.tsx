
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Check, UserCircle, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TeacherModeProps {
  onSendMessage: (message: string) => void;
}

const TeacherMode: React.FC<TeacherModeProps> = ({ onSendMessage }) => {
  const { t, language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customSubject, setCustomSubject] = useState(false);
  const form = useForm({
    defaultValues: {
      subject: '',
      customSubjectText: '',
      chapter: '',
      studentName: '',
      teachingStyle: 'teacher',
      category: 'concise',
      action: 'read'
    }
  });

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

  const handleSubmit = form.handleSubmit((data) => {
    setIsProcessing(true);
    
    const selectedSubject = customSubject ? data.customSubjectText : data.subject;
    
    const teachingStyle = data.teachingStyle === 'teacher' 
      ? (language === 'en' 
        ? `Teach this like a real teacher who addresses me directly as "${data.studentName || 'student'}"`
        : `इसे एक वास्तविक शिक्षक की तरह पढ़ाएं जो मुझे सीधे "${data.studentName || 'विद्यार्थी'}" के रूप में संबोधित करे`)
      : (language === 'en'
        ? 'Provide standard text-based content'
        : 'मानक टेक्स्ट-आधारित सामग्री प्रदान करें');
      
    const category = data.category === 'concise'
      ? (language === 'en'
        ? 'Keep it concise and highlight the main points'
        : 'इसे संक्षिप्त रखें और मुख्य बिंदुओं पर प्रकाश डालें')
      : (language === 'en'
        ? 'Give a detailed explanation with complete information'
        : 'पूरी जानकारी के साथ विस्तृत व्याख्या दें');
      
    const action = data.action === 'notes'
      ? (language === 'en'
        ? 'Generate study notes that I can use'
        : 'अध्ययन नोट्स तैयार करें जिन्हें मैं उपयोग कर सकूं')
      : (language === 'en'
        ? 'Explain the content for understanding'
        : 'समझने के लिए सामग्री की व्याख्या करें');
    
    let prompt = '';
    
    if (language === 'en') {
      prompt = `Act as a professional teacher in ${data.teachingStyle === 'teacher' ? 'interactive teaching mode' : 'standard teaching mode'}. 
Subject: ${selectedSubject}
Chapter: ${data.chapter}
Student Name: ${data.studentName || 'Student'}
Approach: ${teachingStyle}
Detail Level: ${category}
Action: ${action}

${data.teachingStyle === 'teacher' ? `Address me directly as "${data.studentName || 'Student'}", ask questions occasionally to ensure understanding, and teach in a way that feels like a live classroom experience.` : ''}`;
    } else {
      prompt = `एक पेशेवर शिक्षक के रूप में कार्य करें ${data.teachingStyle === 'teacher' ? 'इंटरैक्टिव शिक्षण मोड' : 'मानक शिक्षण मोड'} में।
विषय: ${selectedSubject}
अध्याय: ${data.chapter}
विद्यार्थी का नाम: ${data.studentName || 'विद्यार्थी'}
दृष्टिकोण: ${teachingStyle}
विवरण स्तर: ${category}
कार्रवाई: ${action}

${data.teachingStyle === 'teacher' ? `मुझे सीधे "${data.studentName || 'विद्यार्थी'}" के रूप में संबोधित करें, समझ सुनिश्चित करने के लिए कभी-कभी प्रश्न पूछें, और इस तरह से पढ़ाएं जो एक लाइव कक्षा अनुभव जैसा लगे।` : ''}`;
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
                  <UserCircle className="h-4 w-4" />
                  {t('generateTeaching')}
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TeacherMode;
