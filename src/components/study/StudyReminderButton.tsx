
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Bell, BookOpen, TimerOff, Calendar, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addPointsToUser } from '@/utils/points';
import { Badge } from "@/components/ui/badge";

const StudyReminderButton: React.FC = () => {
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [todaysTask, setTodaysTask] = useState<any>(null);
  const [nextTaskTime, setNextTaskTime] = useState<string>("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (currentUser) {
      const savedPlan = localStorage.getItem(`${currentUser.uid}_study_plan`);
      const savedTasksAccepted = localStorage.getItem(`${currentUser.uid}_tasks_accepted`);
      
      if (savedPlan && savedTasksAccepted === 'true') {
        setHasActivePlan(true);
        
        // Load today's tasks
        const savedTasks = localStorage.getItem(`${currentUser.uid}_study_tasks`);
        if (savedTasks) {
          try {
            const tasks = JSON.parse(savedTasks);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const todaysTasks = tasks.filter((task: any) => {
              const taskDate = new Date(task.scheduled);
              taskDate.setHours(0, 0, 0, 0);
              return taskDate.getTime() === today.getTime() && !task.completed;
            });
            
            if (todaysTasks.length > 0) {
              setTodaysTask(todaysTasks[0]);
              
              // Calculate when the next task is due
              const now = new Date();
              const taskTime = new Date(todaysTasks[0].scheduled);
              if (taskTime > now) {
                const hours = taskTime.getHours();
                const minutes = taskTime.getMinutes();
                setNextTaskTime(`${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
              } else {
                setNextTaskTime("अभी");
              }
            }
          } catch (error) {
            console.error('Error parsing saved tasks:', error);
          }
        }
      } else {
        setHasActivePlan(false);
      }
    }
  }, [currentUser]);
  
  const handleOpenAdvancedTools = () => {
    navigate("/student-activities", { state: { tab: "planner" } });
  };
  
  if (!currentUser || !hasActivePlan) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mb-6"
      >
        <Button 
          onClick={handleOpenAdvancedTools}
          className="w-full font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md h-auto py-4 rounded-lg border-0 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          <div className="flex items-center justify-center space-x-3 z-10 relative">
            <div className="relative">
              <Bell className="h-6 w-6 text-yellow-300" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-lg">अध्ययन अनुस्मारक</span>
              <span className="text-xs text-gray-200">अपनी अध्ययन योजना बनाएं</span>
            </div>
          </div>
        </Button>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-4 shadow-lg mb-6 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          आज का अध्ययन
        </h3>
        <Badge className="bg-white/20 text-white hover:bg-white/30">
          {nextTaskTime === "अभी" ? "अभी शुरू करें" : `${nextTaskTime} बजे`}
        </Badge>
      </div>
      
      {todaysTask ? (
        <div className="bg-white/10 rounded-md p-3 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-purple-200 text-sm font-medium">{todaysTask.subject}</span>
              <h4 className="text-white font-medium">{todaysTask.name}</h4>
              <div className="flex items-center mt-1 text-white/70 text-sm">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>{todaysTask.duration} मिनट</span>
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-white text-purple-700 hover:bg-purple-100"
              onClick={() => navigate("/student-activities", { state: { tab: "timer" } })}
            >
              शुरू करें
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-white mb-3 text-center py-2">
          आज के सभी कार्य पूरे हो गए हैं!
        </div>
      )}
      
      <Button 
        variant="link" 
        className="text-white/80 hover:text-white w-full text-sm px-0 mt-2"
        onClick={() => navigate("/student-activities", { state: { tab: "timer" } })}
      >
        सभी कार्य देखें
        <Check className="ml-1 h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default StudyReminderButton;
