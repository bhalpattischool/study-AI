
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
import { ThemeWrapper } from './ThemeWrapper';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AboutPage from './pages/AboutPage';
import NotificationToast from './components/notifications/NotificationToast';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
              <Route path="/messages" element={<ChatHistory />} />
              <Route path="/saved-messages" element={<SavedMessages />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/student-activities" element={<StudentActivities />} />
              <Route path="/teacher-chats" element={<TeacherChats />} />
              <Route path="/student-profile/:id" element={<StudentProfile />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <NotificationToast />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeWrapper>
  );
}

export default App;
