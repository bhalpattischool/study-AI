
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, RefreshCw, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { generateResponse } from '@/lib/gemini';
import { useNavigate } from 'react-router-dom';

interface StudyPlannerProps {
  onSendMessage: (message: string) => void;
}

interface StudyTask {
  name: string;
  subject: string;
  scheduled: string; // ISO date string
  duration: number; // minutes
  completed: boolean;
  id: string;
}

const StudyPlanner: React.FC<StudyPlannerProps> = ({ onSendMessage }) => {
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [subjects, setSubjects] = useState('');
  const [dailyHours, setDailyHours] = useState('2');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [studyPlanAccepted, setStudyPlanAccepted] = useState(false);
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Check if user already has an active plan
  useEffect(() => {
    if (currentUser) {
      const savedPlan = localStorage.getItem(`${currentUser.uid}_study_plan`);
      const savedTasksAccepted = localStorage.getItem(`${currentUser.uid}_tasks_accepted`);
      
      if (savedPlan && savedTasksAccepted === 'true') {
        setStudyPlanAccepted(true);
      }
    }
  }, [currentUser]);

  const handleGeneratePlan = async () => {
    if (!examName.trim() || !examDate.trim() || !subjects.trim()) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }

    setIsLoading(true);
    try {
      const subjectList = subjects.split(',').map(s => s.trim()).join(', ');
      
      let prompt = '';
      
      if (language === 'en') {
        prompt = `Create a detailed study plan for my ${examName} exam on ${examDate}. I need to study these subjects: ${subjectList}. I can dedicate ${dailyHours} hours daily for studying. Please include:
  1. Daily schedule with specific topics
  2. Weekly milestones
  3. Recommended study techniques for each subject
  4. When to schedule revision sessions
  5. Short breaks and self-care recommendations`;
      } else {
        prompt = `मेरी ${examName} परीक्षा के लिए ${examDate} को एक विस्तृत अध्ययन योजना बनाएं। मुझे इन विषयों का अध्ययन करने की आवश्यकता है: ${subjectList}। मैं अध्ययन के लिए दैनिक ${dailyHours} घंटे समर्पित कर सकता हूँ। कृपया शामिल करें:
  1. विशिष्ट विषयों के साथ दैनिक कार्यक्रम
  2. साप्ताहिक लक्ष्य
  3. प्रत्येक विषय के लिए अनुशंसित अध्ययन तकनीकें
  4. पुनरीक्षण सत्रों को कब निर्धारित करना है
  5. छोटे ब्रेक और स्व-देखभाल की सिफारिशें

  साथ ही, कृपया पहले सप्ताह के लिए दिन-प्रतिदिन कार्यों की एक सूची भी प्रदान करें, जिसमें प्रत्येक कार्य के लिए विषय, अध्ययन समय (मिनटों में), और अध्ययन सामग्री शामिल हो।`;
      }
      
      // Use Gemini API to generate the study plan
      const plan = await generateResponse(prompt);
      console.log("Generated plan:", plan);
      
      // Save plan to state and show dialog
      setGeneratedPlan(plan);
      setShowPlanDialog(true);
      
      // Also send to chat if that functionality is available
      if (onSendMessage) {
        onSendMessage(prompt);
      }
    } catch (error) {
      console.error("Error generating study plan:", error);
      toast.error(language === 'en' ? 'Failed to generate study plan' : 'अध्ययन योजना जनरेट करने में विफल');
    } finally {
      setIsLoading(false);
    }
  };

  const acceptStudyPlan = () => {
    if (!currentUser) {
      toast.error(language === 'en' ? 'Please log in to save your study plan' : 'अपनी अध्ययन योजना सहेजने के लिए कृपया लॉग इन करें');
      return;
    }
    
    // Parse the generated plan to extract tasks (simplified example)
    // In a real implementation, you would need more sophisticated parsing
    const parseTasksFromPlan = (plan: string): StudyTask[] => {
      // This is a simplified example - in reality, you would need more sophisticated parsing
      // based on the structure of your AI's response
      const lines = plan.split('\n');
      const tasks: StudyTask[] = [];
      
      // Start date is today
      const startDate = new Date();
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Very simple example of extracting task information - you would need to improve this
        if (line.includes(':') && !line.includes('#') && !line.includes('daily') && !line.includes('Daily')) {
          const subjectMatch = subjects.split(',').find(subject => line.includes(subject.trim()));
          
          if (subjectMatch) {
            // Create a task for each day in the first week
            for (let day = 0; day < 7; day++) {
              const taskDate = new Date(startDate);
              taskDate.setDate(startDate.getDate() + day);
              
              // Assign random duration between 30-60 minutes
              const duration = Math.floor(Math.random() * 31) + 30;
              
              tasks.push({
                name: line.split(':')[1]?.trim() || `Study ${subjectMatch}`,
                subject: subjectMatch.trim(),
                scheduled: taskDate.toISOString(),
                duration: duration,
                completed: false,
                id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
              });
            }
          }
        }
      }
      
      // If we couldn't extract tasks, create some default ones
      if (tasks.length === 0) {
        const subjectList = subjects.split(',');
        
        subjectList.forEach((subject, index) => {
          for (let day = 0; day < 7; day++) {
            const taskDate = new Date(startDate);
            taskDate.setDate(startDate.getDate() + day);
            taskDate.setHours(10 + index, 0, 0, 0); // Different time for each subject
            
            tasks.push({
              name: `Study ${subject.trim()}`,
              subject: subject.trim(),
              scheduled: taskDate.toISOString(),
              duration: 45, // 45 minutes
              completed: false,
              id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            });
          }
        });
      }
      
      return tasks;
    };
    
    // Save the plan and tasks to localStorage
    localStorage.setItem(`${currentUser.uid}_study_plan`, generatedPlan);
    localStorage.setItem(`${currentUser.uid}_study_tasks`, JSON.stringify(parseTasksFromPlan(generatedPlan)));
    localStorage.setItem(`${currentUser.uid}_tasks_accepted`, 'true');
    
    setStudyPlanAccepted(true);
    setShowPlanDialog(false);
    
    toast.success(language === 'en' ? 'Study plan accepted! Your tasks are ready.' : 'अध्ययन योजना स्वीकृत! आपके कार्य तैयार हैं।');
    
    // Navigate to home to see the study reminder
    navigate('/');
  };

  const declineStudyPlan = () => {
    setShowPlanDialog(false);
    toast(language === 'en' ? 'Study plan declined' : 'अध्ययन योजना अस्वीकृत की गई');
  };

  const cancelExistingPlan = () => {
    if (currentUser) {
      localStorage.removeItem(`${currentUser.uid}_study_plan`);
      localStorage.removeItem(`${currentUser.uid}_study_tasks`);
      localStorage.removeItem(`${currentUser.uid}_tasks_accepted`);
      setStudyPlanAccepted(false);
      toast.success(language === 'en' ? 'Existing study plan cancelled' : 'मौजूदा अध्ययन योजना रद्द की गई');
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            {t('studyPlanner')}
          </CardTitle>
          <CardDescription>
            {studyPlanAccepted 
              ? (language === 'en' ? 'You have an active study plan' : 'आपकी एक सक्रिय अध्ययन योजना है') 
              : t('plannerDescription')}
          </CardDescription>
        </CardHeader>
        
        {studyPlanAccepted ? (
          <CardContent className="space-y-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md text-center">
              <p className="mb-2 font-medium">
                {language === 'en' ? 'Your study plan is active' : 'आपकी अध्ययन योजना सक्रिय है'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {language === 'en' 
                  ? 'Your daily tasks are being shown on the home screen.' 
                  : 'आपके दैनिक कार्य होम स्क्रीन पर दिखाए जा रहे हैं।'}
              </p>
              <Button variant="destructive" size="sm" onClick={cancelExistingPlan}>
                {language === 'en' ? 'Cancel Plan' : 'योजना रद्द करें'}
              </Button>
            </div>
          </CardContent>
        ) : (
          <>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="examName" className="block text-sm font-medium mb-1">
                  {t('examName')}
                </label>
                <Input
                  id="examName"
                  placeholder={t('examNamePlaceholder')}
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="examDate" className="block text-sm font-medium mb-1">
                  {t('examDate')}
                </label>
                <Input
                  id="examDate"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="subjects" className="block text-sm font-medium mb-1">
                  {t('subjects')}
                </label>
                <Input
                  id="subjects"
                  placeholder={t('subjectsPlaceholder')}
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="dailyHours" className="block text-sm font-medium mb-1">
                  {t('hoursAvailable')}
                </label>
                <select
                  id="dailyHours"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(e.target.value)}
                >
                  <option value="1">1 {t('hour')}</option>
                  <option value="2">2 {t('hours')}</option>
                  <option value="3">3 {t('hours')}</option>
                  <option value="4">4 {t('hours')}</option>
                  <option value="5">{t('plusHours')}</option>
                </select>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={handleGeneratePlan} 
                disabled={isLoading || !examName.trim() || !examDate || !subjects.trim()} 
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {t('processing')}
                  </>
                ) : (
                  t('generatePlan')
                )}
              </Button>
            </CardFooter>
          </>
        )}
      </Card>

      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{language === 'en' ? 'Your Study Plan' : 'आपकी अध्ययन योजना'}</DialogTitle>
            <DialogDescription>
              {language === 'en' 
                ? 'Review your personalized study plan. Would you like to accept and start following it?'
                : 'अपनी व्यक्तिगत अध्ययन योजना की समीक्षा करें। क्या आप इसे स्वीकार करके इसका पालन करना चाहेंगे?'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="whitespace-pre-wrap text-sm border p-4 rounded-md overflow-y-auto max-h-[400px] bg-gray-50 dark:bg-gray-900">
            {generatedPlan}
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={declineStudyPlan}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              {language === 'en' ? 'Decline' : 'अस्वीकार करें'}
            </Button>
            <Button 
              onClick={acceptStudyPlan}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              {language === 'en' ? 'Accept Plan' : 'योजना स्वीकार करें'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StudyPlanner;
