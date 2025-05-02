
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeWrapper } from '@/ThemeWrapper';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import Profile from '@/pages/Profile';
import ChatHistory from '@/pages/ChatHistory';
import SavedMessages from '@/pages/SavedMessages';
import NotFound from '@/pages/NotFound';
import TeacherChats from '@/pages/TeacherChats';
import StudentProfile from '@/pages/StudentProfile';
import StudentActivities from '@/pages/StudentActivities';
import Feedback from '@/pages/Feedback';
import ChatSystem from '@/pages/ChatSystem';
import { Toaster as SonnerToaster } from 'sonner';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <ThemeWrapper>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/messages" element={<ChatHistory />} />
              <Route path="/saved" element={<SavedMessages />} />
              <Route path="/teacher" element={<TeacherChats />} />
              <Route path="/student/:studentId" element={<StudentProfile />} />
              <Route path="/student-activities" element={<StudentActivities />} />
              <Route path="/activities" element={<StudentActivities />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/chat" element={<ChatSystem />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <SonnerToaster position="top-right" closeButton richColors />
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeWrapper>
    </ThemeProvider>
  );
}

export default App;
