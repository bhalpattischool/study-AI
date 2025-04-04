
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, Link2, User, Award, Star } from 'lucide-react';
import { toast } from 'sonner';

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
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [profileUrl, setProfileUrl] = useState<string>('');
  
  useEffect(() => {
    if (currentUser) {
      generateQRCode();
      
      // Generate profile URL
      const baseUrl = window.location.origin;
      const profileLink = `${baseUrl}/student-profile/${currentUser.uid}`;
      setProfileUrl(profileLink);
    }
  }, [currentUser, studentPoints, studentLevel]);
  
  const generateQRCode = async () => {
    if (!currentUser) return;
    
    // Create profile data object
    const profileData = {
      id: currentUser.uid,
      name: currentUser.displayName || 'Student',
      level: studentLevel,
      points: studentPoints,
      category: localStorage.getItem(`userCategory`) || 'student',
      education: localStorage.getItem(`educationLevel`) || 'high-school',
      joinedOn: currentUser.metadata?.creationTime || new Date().toISOString(),
      photoURL: currentUser.photoURL,
      achievements: getTopAchievements()
    };
    
    // Convert to base64 encoded JSON string
    const jsonString = JSON.stringify(profileData);
    const encodedData = btoa(jsonString);
    
    // Generate profile URL to include in QR
    const baseUrl = window.location.origin;
    const profileLink = `${baseUrl}/student-profile/${currentUser.uid}`;
    
    // Generate QR code URL using Google Charts API
    const googleChartsUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(profileLink)}&choe=UTF-8`;
    setQrCodeUrl(googleChartsUrl);
    
    try {
      // Convert QR code to data URL for download
      const response = await fetch(googleChartsUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrDataUrl(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };
  
  const getTopAchievements = () => {
    if (!currentUser) return [];
    
    // Get points history
    const history = JSON.parse(localStorage.getItem(`${currentUser.uid}_points_history`) || '[]');
    
    // Filter achievements and sort by points
    const achievements = history
      .filter((item: any) => ['achievement', 'quiz'].includes(item.type))
      .sort((a: any, b: any) => b.points - a.points)
      .slice(0, 3); // Get top 3
      
    return achievements;
  };
  
  const downloadQRCode = () => {
    if (!qrDataUrl) return;
    
    const a = document.createElement('a');
    a.href = qrDataUrl;
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
            <img 
              src={qrCodeUrl} 
              alt="Profile QR Code" 
              className="w-60 h-60 border p-2 rounded-lg bg-white"
            />
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
