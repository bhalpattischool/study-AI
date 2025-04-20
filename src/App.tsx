
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import SavedMessages from "./pages/SavedMessages";
import ChatHistory from "./pages/ChatHistory";
import TeacherChats from "./pages/TeacherChats";
import Feedback from "./pages/Feedback";
import StudentActivities from "./pages/StudentActivities";
import StudentProfile from "./pages/StudentProfile";
import { AuthProvider } from "./contexts/AuthContext";
import StudyTimerFloatingWidget from "./components/study/floating-timer";
import { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { currentUser } = useAuth();
  const [timerData, setTimerData] = useState({
    isActive: false,
    timeLeft: 0,
    taskName: ""
  });

  // Check if there's an active study session
  useEffect(() => {
    if (!currentUser) return;
    
    const checkActiveTimers = () => {
      const activeSession = localStorage.getItem(`${currentUser.uid}_active_study_session`);
      
      if (activeSession === 'true') {
        // Find which timer is active
        const storage = localStorage;
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key?.includes(`${currentUser.uid}_timer_`) && key.includes('timer')) {
            try {
              const timerState = JSON.parse(storage.getItem(key) || '{}');
              if (timerState.isRunning) {
                setTimerData({
                  isActive: true,
                  timeLeft: timerState.timeRemaining || 0,
                  taskName: timerState.taskName || "Study Session"
                });
                break;
              }
            } catch (e) {
              console.error('Error parsing timer data:', e);
            }
          }
        }
      } else {
        setTimerData({
          isActive: false,
          timeLeft: 0,
          taskName: ""
        });
      }
    };
    
    checkActiveTimers();
    // Check every 5 seconds
    const interval = setInterval(checkActiveTimers, 5000);
    
    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/saved-messages" element={<SavedMessages />} />
        <Route path="/chat-history" element={<ChatHistory />} />
        <Route path="/teacher-chats" element={<TeacherChats />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/student-activities" element={<StudentActivities />} />
        <Route path="/student-profile/:userId" element={<StudentProfile />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <StudyTimerFloatingWidget 
        isActive={timerData.isActive}
        timeLeft={timerData.timeLeft}
        taskName={timerData.taskName}
      />
    </>
  );
}

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
