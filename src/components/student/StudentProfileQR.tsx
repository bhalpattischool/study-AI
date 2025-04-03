
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from 'lucide-react';
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
  
  useEffect(() => {
    if (currentUser) {
      generateQRCode();
    }
  }, [currentUser, studentPoints, studentLevel]);
  
  const generateQRCode = async () => {
    if (!currentUser) return;
    
    // Create profile data object
    const profileData = {
      name: currentUser.displayName || 'Student',
      level: studentLevel,
      points: studentPoints,
      category: localStorage.getItem(`userCategory`) || 'student',
      education: localStorage.getItem(`educationLevel`) || 'high-school',
      joinedOn: currentUser.metadata?.creationTime || new Date().toISOString()
    };
    
    // Convert to base64 encoded JSON string
    const jsonString = JSON.stringify(profileData);
    const encodedData = btoa(jsonString);
    
    // Generate QR code URL using Google Charts API
    const googleChartsUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(encodedData)}&choe=UTF-8`;
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
      toast.error('शेयरिंग इस डिवाइस पर उपलब्ध नहीं है');
      return;
    }
    
    try {
      await navigator.share({
        title: `${currentUser?.displayName || 'Student'} का अध्ययन प्रोफाइल`,
        text: `देखें ${currentUser?.displayName || 'Student'} का अध्ययन प्रोफाइल! वर्तमान स्तर: ${studentLevel}, अर्जित अंक: ${studentPoints}`,
        url: window.location.href,
      });
      toast.success('प्रोफाइल सफलतापूर्वक शेयर किया गया');
    } catch (error) {
      console.error('Error sharing profile:', error);
      toast.error('प्रोफाइल शेयर करने में त्रुटि');
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger id="qr-dialog" className="hidden">Open QR</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">अपना प्रोफाइल शेयर करें</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
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
          
          <div className="flex gap-3 mt-6">
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
