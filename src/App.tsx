
import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import ChatHistory from './pages/ChatHistory';
import SavedMessages from './pages/SavedMessages';
import Feedback from './pages/Feedback';
import StudentActivities from './pages/StudentActivities';
import TeacherChats from './pages/TeacherChats';
import StudentProfile from './pages/StudentProfile';
import NotFound from './pages/NotFound';
import ChatSystem from './pages/ChatSystem';
import Leaderboard from './pages/Leaderboard';
import Library from './pages/Library';
import MyBooks from './pages/MyBooks';
import UploadBook from './pages/UploadBook';
import { ThemeWrapper } from './ThemeWrapper';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AboutPage from './pages/AboutPage';
import NotificationToast from './components/notifications/NotificationToast';
import NotificationsTestPage from './pages/NotificationsTestPage';
import { initEmailJS } from './utils/emailjs';
import StudyTimerFloatingWidget from './components/study/floating-timer/StudyTimerFloatingWidget';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize EmailJS
    initEmailJS();
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
    </div>;
  }

  return (
    <ThemeWrapper>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat-history" element={<ChatHistory />} />
              <Route path="/messages" element={<ChatHistory />} />
              <Route path="/saved-messages" element={<SavedMessages />} />
              <Route path="/saved" element={<SavedMessages />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/student-activities" element={<StudentActivities />} />
              <Route path="/activities" element={<StudentActivities />} />
              <Route path="/teacher-chats" element={<TeacherChats />} />
              <Route path="/teacher" element={<TeacherChats />} />
              <Route path="/student-profile/:userId" element={<StudentProfile />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/chat" element={<ChatSystem />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/notifications-test" element={<NotificationsTestPage />} />
              <Route path="/library" element={<Library />} />
              <Route path="/library/my-books" element={<MyBooks />} />
              <Route path="/library/upload" element={<UploadBook />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <NotificationToast />
            <StudyTimerFloatingWidget />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeWrapper>
  );
}

export default App;
