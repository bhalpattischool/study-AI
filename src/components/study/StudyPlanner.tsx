
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, RefreshCw, Check, X, Clock, GraduationCap, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { generateStudyPlan } from '@/lib/gemini';
import { useNavigate } from 'react-router-dom';

interface StudyPlannerProps {
  onSendMessage: (message: string) => void;
}

interface StudyTask {
  name: string;
  subject: string;
  chapter?: string;
  topic?: string;
  scheduled: string; // ISO date string
  duration: number; // minutes
  completed: boolean;
  id: string;
  priority?: string;
  objective?: string;
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
      // Use the enhanced generate study plan function
      const plan = await generateStudyPlan(
        examName,
        examDate,
        subjects,
        dailyHours,
        language
      );
      
      console.log("Generated plan:", plan);
      
      // Save plan to state and show dialog
      setGeneratedPlan(plan);
      setShowPlanDialog(true);
      
      // Also send to chat if that functionality is available
      if (onSendMessage) {
        onSendMessage(`${language === 'en' ? 'Generated study plan for' : 'अध्ययन योजना जनरेट की गई'}: ${examName}`);
      }
    } catch (error) {
      console.error("Error generating study plan:", error);
      toast.error(language === 'en' ? 'Failed to generate study plan' : 'अध्ययन योजना जनरेट करने में विफल');
    } finally {
      setIsLoading(false);
    }
  };

  const parseTasksFromPlan = (plan: string): StudyTask[] => {
    const lines = plan.split('\n');
    const tasks: StudyTask[] = [];
    
    let currentDay = new Date();
    let currentSubject = '';
    let currentChapter = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for day markers
      if (line.match(/^day\s+\d+/i) || line.match(/^दिन\s+\d+/i)) {
        // New day found
        const dayMatch = line.match(/\d+/);
        if (dayMatch) {
          const dayOffset = parseInt(dayMatch[0]) - 1;
          currentDay = new Date();
          currentDay.setDate(currentDay.getDate() + dayOffset);
        }
        continue;
      }
      
      // Check for subject markers
      const subjectMatch = subjects.split(',').find(subject => 
        line.toLowerCase().includes(subject.trim().toLowerCase())
      );
      
      if (subjectMatch) {
        currentSubject = subjectMatch.trim();
      }
      
      // Look for chapter information
      if (line.match(/chapter|अध्याय/i)) {
        const chapterMatch = line.match(/chapter\s+\d+|अध्याय\s+\d+/i);
        if (chapterMatch) {
          currentChapter = chapterMatch[0];
        }
      }
      
      // Look for duration information
      const durationMatch = line.match(/(\d+)\s*(?:min|minute|मिनट)/i);
      
      if (durationMatch && currentSubject) {
        const duration = parseInt(durationMatch[1]);
        
        // Extract topic if available
        let topic = '';
        if (line.includes(':')) {
          topic = line.split(':')[1].trim();
        } else if (line.includes('-')) {
          topic = line.split('-').slice(1).join('-').trim();
        }
        
        // Extract priority if available
        let priority = '';
        if (line.toLowerCase().includes('high') || line.includes('उच्च')) {
          priority = 'high';
        } else if (line.toLowerCase().includes('medium') || line.includes('मध्यम')) {
          priority = 'medium';
        } else if (line.toLowerCase().includes('low') || line.includes('निम्न')) {
          priority = 'low';
        }
        
        // Extract learning objective if available
        let objective = '';
        if (line.toLowerCase().includes('objective') || line.includes('उद्देश्य')) {
          const parts = line.split(/objective|उद्देश्य/i);
          if (parts.length > 1) {
            objective = parts[1].trim();
          }
        }
        
        tasks.push({
          name: topic || currentChapter || currentSubject,
          subject: currentSubject,
          chapter: currentChapter || undefined,
          topic: topic || undefined,
          scheduled: currentDay.toISOString(),
          duration: duration,
          completed: false,
          id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          priority: priority || undefined,
          objective: objective || undefined
        });
      }
    }
    
    // If we couldn't extract tasks, create some default ones
    if (tasks.length === 0) {
      const subjectList = subjects.split(',');
      
      subjectList.forEach((subject, index) => {
        for (let day = 0; day < 7; day++) {
          const taskDate = new Date();
          taskDate.setDate(taskDate.getDate() + day);
          taskDate.setHours(10 + index, 0, 0, 0); // Different time for each subject
          
          tasks.push({
            name: `${language === 'en' ? 'Study' : 'अध्ययन'} ${subject.trim()}`,
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

  const acceptStudyPlan = () => {
    if (!currentUser) {
      toast.error(language === 'en' ? 'Please log in to save your study plan' : 'अपनी अध्ययन योजना सहेजने के लिए कृपया लॉग इन करें');
      return;
    }
    
    // Parse the plan into tasks
    const tasks = parseTasksFromPlan(generatedPlan);
    
    // Save the plan and tasks to localStorage
    localStorage.setItem(`${currentUser.uid}_study_plan`, generatedPlan);
    localStorage.setItem(`${currentUser.uid}_study_tasks`, JSON.stringify(tasks));
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
      <Card className="w-full border border-purple-100 dark:border-purple-800 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            {t('studyPlanner')}
          </CardTitle>
          <CardDescription className="text-sm">
            {studyPlanAccepted 
              ? (language === 'en' ? 'You have an active study plan' : 'आपकी एक सक्रिय अध्ययन योजना है') 
              : t('plannerDescription')}
          </CardDescription>
        </CardHeader>
        
        {studyPlanAccepted ? (
          <CardContent className="pb-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-1" />
                <p className="text-sm font-medium">
                  {language === 'en' ? 'Your study plan is active' : 'आपकी अध्ययन योजना सक्रिय है'}
                </p>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                {language === 'en' 
                  ? 'Your daily tasks are being shown on the home screen.' 
                  : 'आपके दैनिक कार्य होम स्क्रीन पर दिखाए जा रहे हैं।'}
              </p>
              <Button variant="destructive" size="sm" onClick={cancelExistingPlan} className="h-8 text-xs px-3">
                {language === 'en' ? 'Cancel Plan' : 'योजना रद्द करें'}
              </Button>
            </div>
          </CardContent>
        ) : (
          <>
            <CardContent className="space-y-3 pb-3">
              <div>
                <label htmlFor="examName" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t('examName')}
                </label>
                <Input
                  id="examName"
                  placeholder={t('examNamePlaceholder')}
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="border-purple-100 dark:border-purple-800 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="examDate" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t('examDate')}
                </label>
                <Input
                  id="examDate"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="border-purple-100 dark:border-purple-800 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="subjects" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t('subjects')}
                </label>
                <Input
                  id="subjects"
                  placeholder={t('subjectsPlaceholder')}
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  className="border-purple-100 dark:border-purple-800 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="dailyHours" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {t('hoursAvailable')}
                </label>
                <select
                  id="dailyHours"
                  className="w-full px-3 py-2 border rounded-md text-sm border-purple-100 dark:border-purple-800 focus:ring-purple-500"
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
            
            <CardFooter className="pt-0 pb-4">
              <Button 
                onClick={handleGeneratePlan} 
                disabled={isLoading || !examName.trim() || !examDate || !subjects.trim()} 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              {language === 'en' ? 'Your Study Plan' : 'आपकी अध्ययन योजना'}
            </DialogTitle>
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
              className="flex items-center gap-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
            >
              <X className="h-4 w-4" />
              {language === 'en' ? 'Decline' : 'अस्वीकार करें'}
            </Button>
            <Button 
              onClick={acceptStudyPlan}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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
