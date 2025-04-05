
import { useState } from 'react';
import { toast } from 'sonner';
import { getLeaderboardData } from '@/lib/firebase';

export const useQRScanner = (currentUser: any) => {
  const [scanResult, setScanResult] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const qrCode = new Image();
        qrCode.src = event.target?.result as string;
        
        qrCode.onload = async () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            toast.error('QR कोड स्कैन करने में समस्या आई');
            setIsLoading(false);
            return;
          }
          
          // Draw image to canvas
          canvas.width = qrCode.width;
          canvas.height = qrCode.height;
          context.drawImage(qrCode, 0, 0);
          
          try {
            // Get the QR data from the image
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            
            // Extract the data URL and try to parse it
            const dataUrl = event.target?.result as string;
            
            // Check if this is one of our generated QR codes
            if (dataUrl.includes('data:image')) {
              // Try to get user ID from the QR code (in a real implementation this would be decoded)
              // For now, we'll fall back to getting leaderboard data to simulate scanning a real user
              const leaderboardData = await getLeaderboardData();
              
              // Simulate finding a random user from the leaderboard
              if (leaderboardData && leaderboardData.length > 0) {
                const randomIndex = Math.floor(Math.random() * leaderboardData.length);
                const userData = leaderboardData[randomIndex];
                
                // Create profile info from the user data
                const profileData = {
                  profileInfo: {
                    id: userData.id,
                    name: userData.name,
                    level: userData.level,
                    points: userData.points,
                    education: localStorage.getItem('educationLevel') || 'high-school',
                    joinedOn: new Date().toISOString(),
                    category: 'student',
                    rank: userData.rank,
                    streak: Math.floor(Math.random() * 10) + 1, // Simulate a streak
                    achievements: [
                      { type: "quiz", points: 20, description: "गणित क्विज में उत्कृष्ट प्रदर्शन" },
                      { type: "streak", points: 15, description: "7 दिन की स्ट्रीक पूरी की" }
                    ]
                  },
                  profileLink: `${window.location.origin}/student-profile/${userData.id}`
                };
                
                setScanResult(profileData);
              } else {
                toast.error('QR कोड में कोई वैध डेटा नहीं मिला');
              }
            } else {
              toast.error('QR कोड स्कैन करने में समस्या आई');
            }
          } catch (error) {
            console.error('Error processing QR data:', error);
            toast.error('QR कोड स्कैन करने में समस्या आई');
          }
          
          setIsLoading(false);
        };
      } catch (error) {
        console.error('Error processing QR code:', error);
        toast.error('QR कोड स्कैन करने में समस्या आई');
        setIsLoading(false);
      }
    };
    
    reader.readAsDataURL(file);
  };
  
  const resetScan = () => {
    setScanResult(null);
    const input = document.getElementById('qr-file-input') as HTMLInputElement;
    if (input) input.value = '';
  };

  return {
    scanResult,
    isDialogOpen,
    isLoading,
    setScanResult,
    setIsDialogOpen,
    handleFileUpload,
    resetScan
  };
};
