
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Check, UserCircle, ChalkboardTeacher } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TeacherModeProps {
  onSendMessage: (message: string) => void;
}

const TeacherMode: React.FC<TeacherModeProps> = ({ onSendMessage }) => {
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const form = useForm({
    defaultValues: {
      subject: '',
      chapter: '',
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
  ];

  const handleSubmit = form.handleSubmit((data) => {
    setIsProcessing(true);
    
    const teachingStyle = data.teachingStyle === 'teacher' 
      ? 'Teach this like a real teacher who addresses me directly' 
      : 'Provide standard text-based content';
      
    const category = data.category === 'concise'
      ? 'Keep it concise and highlight the main points'
      : 'Give a detailed explanation with complete information';
      
    const action = data.action === 'notes'
      ? 'Generate study notes that I can use'
      : 'Explain the content for understanding';
    
    const prompt = `Act as a professional teacher in ${data.teachingStyle === 'teacher' ? 'interactive teaching mode' : 'standard teaching mode'}. 
    Subject: ${data.subject}
    Chapter: ${data.chapter}
    Approach: ${teachingStyle}
    Detail Level: ${category}
    Action: ${action}
    
    ${data.teachingStyle === 'teacher' ? 'Address me directly as a student, ask questions occasionally to ensure understanding, and teach in a way that feels like a live classroom experience.' : ''}`;
    
    onSendMessage(prompt);
    setIsProcessing(false);
  });

  return (
    <Card className="border border-purple-100 dark:border-purple-800">
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-medium mb-2">
            <ChalkboardTeacher className="h-5 w-5" />
            <h3 className="text-lg font-semibold">{t('teacherMode')}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('teacherModeDescription')}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('subject')}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
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
