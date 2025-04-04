
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Link2, User, Award, Star } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { getUserPointsHistory } from '@/lib/firebase';

interface StudentProfileQRProps {
  currentUser: any;
  studentPoints: number;
  studentLevel: number;
}

const StudentProfileQR: React.FC<StudentProfileQRProps> = ({ 
  currentUser, 
  studentPoints, 
  studentLevel 
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [profileUrl, setProfileUrl] = useState<string>('');
  const [profileData, setProfileData] = useState<any>(null);
  
  useEffect(() => {
    if (currentUser) {
      loadProfileData();
    }
  }, [currentUser, studentPoints, studentLevel]);
  
  const loadProfileData = async () => {
    if (!currentUser) return;
    
    try {
      // Create profile data object with complete student information
      const achievements = await getTopAchievements();
      
      // Get education level and category
      const category = localStorage.getItem(`userCategory`) || 'student';
      const education = localStorage.getItem(`educationLevel`) || 'high-school';
      
      // Create profile data object
      const profileInfo = {
        id: currentUser.uid,
        name: currentUser.displayName || 'Student',
        level: studentLevel,
        points: studentPoints,
        category: category,
        education: education,
        joinedOn: currentUser.metadata?.creationTime || new Date().toISOString(),
        photoURL: currentUser.photoURL,
        achievements: achievements
      };
      
      setProfileData(profileInfo);
      
      // Generate profile URL
      const baseUrl = window.location.origin;
      const profileLink = `${baseUrl}/student-profile/${currentUser.uid}`;
      setProfileUrl(profileLink);
      
      // Generate QR code with embedded profile data
      generateQRCode(profileInfo, profileLink);
    } catch (error) {
      console.error('Error generating profile data:', error);
      toast.error('प्रोफाइल डेटा जनरेट करने में समस्या आई');
    }
  };
  
  const generateQRCode = async (profileData: any, profileLink: string) => {
    try {
      // Create a combined data object with profile data and link
      const qrData = {
        profileLink: profileLink,
        profileInfo: profileData
      };
      
      // Convert the data object to a JSON string
      const qrDataString = JSON.stringify(qrData);
      
      // Generate QR code using the qrcode library
      const qrDataUrl = await QRCode.toDataURL(qrDataString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#5a287d', // Purple color for dots
          light: '#FFFFFF', // White background
        }
      });
      
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('QR कोड जनरेट करने में समस्या आई');
    }
  };
  
  const getTopAchievements = async () => {
    if (!currentUser) return [];
    
    try {
      // Try to get history from Firebase
      const firebaseHistory = await getUserPointsHistory(currentUser.uid);
      
      if (firebaseHistory && firebaseHistory.length > 0) {
        // Filter achievements and sort by points
        return firebaseHistory
          .filter((item: any) => ['achievement', 'quiz'].includes(item.type))
          .sort((a: any, b: any) => b.points - a.points)
          .slice(0, 3); // Get top 3
      }
      
      // Fallback to localStorage
      const history = JSON.parse(localStorage.getItem(`${currentUser.uid}_points_history`) || '[]');
      
      // Filter achievements and sort by points
      return history
        .filter((item: any) => ['achievement', 'quiz'].includes(item.type))
        .sort((a: any, b: any) => b.points - a.points)
        .slice(0, 3); // Get top 3
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  };
  
  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `${currentUser?.displayName || 'student'}-profile-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('QR कोड डाउनलोड किया गया');
  };
  
  const shareProfile = async () => {
    if (!navigator.share) {
      navigator.clipboard.writeText(profileUrl);
      toast.success('प्रोफाइल लिंक कॉपी किया गया');
      return;
    }
    
    try {
      await navigator.share({
        title: `${currentUser?.displayName || 'Student'} का अध्ययन प्रोफाइल`,
        text: `देखें ${currentUser?.displayName || 'Student'} का अध्ययन प्रोफाइल! वर्तमान स्तर: ${studentLevel}, अर्जित अंक: ${studentPoints}`,
        url: profileUrl,
      });
      toast.success('प्रोफाइल सफलतापूर्वक शेयर किया गया');
    } catch (error) {
      console.error('Error sharing profile:', error);
      toast.error('प्रोफाइल शेयर करने में त्रुटि');
    }
  };
  
  const copyProfileLink = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('प्रोफाइल लिंक कॉपी किया गया');
  };
  
  return (
    <Dialog>
      <DialogTrigger id="qr-dialog" className="hidden">Open QR</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">अपना प्रोफाइल शेयर करें</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <div className="mb-4">
            <div className="flex flex-col items-center gap-2">
              {currentUser?.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-700">
                  {(currentUser?.displayName || 'S').charAt(0)}
                </div>
              )}
              <div className="text-center">
                <h3 className="font-bold">{currentUser?.displayName || 'Student'}</h3>
                <div className="flex items-center gap-2 justify-center mt-1">
                  <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                    <Star className="h-3 w-3" /> {studentPoints} पॉइंट्स
                  </Badge>
                  <Badge className="bg-indigo-100 text-indigo-800 flex items-center gap-1">
                    <Award className="h-3 w-3" /> Level {studentLevel}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          {qrCodeUrl ? (
            <div className="relative">
              <img 
                src={qrCodeUrl} 
                alt="Profile QR Code" 
                className="w-60 h-60 border p-2 rounded-lg bg-white"
              />
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md">
                <User className="h-4 w-4 text-purple-700" />
              </div>
            </div>
          ) : (
            <div className="w-60 h-60 border p-2 rounded-lg bg-gray-100 flex items-center justify-center">
              <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
          )}
          
          <p className="text-sm text-center mt-4 text-gray-600">
            इस QR कोड को स्कैन करके अपने दोस्तों के साथ अपना अध्ययन प्रोफाइल शेयर करें
          </p>
          
          <div className="w-full mt-4">
            <div className="flex items-center justify-between border rounded-md p-2 bg-gray-50">
              <div className="truncate flex-1 text-sm text-gray-600">
                {profileUrl}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2" 
                onClick={copyProfileLink}
              >
                <Link2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-6 w-full">
            <Button 
              variant="outline" 
              onClick={downloadQRCode}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              डाउनलोड
            </Button>
            <Button 
              onClick={shareProfile}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              शेयर
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileQR;
