
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Award, Share2, LinkIcon, Upload } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { ProfileData } from '@/types/student';
import { uploadFile } from '@/lib/firebase/storage';
import { auth } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';

interface ProfileBannerProps {
  profileData: ProfileData;
  levelProgress: number;
}

const ProfileBanner: React.FC<ProfileBannerProps> = ({ profileData, levelProgress }) => {
  // Ensure we have valid data
  const name = profileData?.name || 'Student';
  const points = profileData?.points || 0;
  const level = profileData?.level || 1;
  const photoURL = profileData?.photoURL || '';
  
  const [uploading, setUploading] = useState(false);
  
  const shareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${name} का अध्ययन प्रोफाइल`,
          text: `देखें ${name} का अध्ययन प्रोफाइल! वर्तमान स्तर: ${level}, अर्जित अंक: ${points}`,
          url: window.location.href,
        });
        toast.success('प्रोफाइल शेयर किया गया');
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast.success('प्रोफाइल लिंक कॉपी किया गया');
      }
    } catch (error) {
      console.error('Error sharing profile:', error);
      toast.error('शेयर करने में त्रुटि');
    }
  };
  
  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('प्रोफाइल लिंक कॉपी किया गया');
  };
  
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && auth.currentUser) {
      const file = e.target.files[0];
      
      try {
        setUploading(true);
        const userId = auth.currentUser.uid;
        const path = `profile_images/${userId}`;
        const { downloadURL } = await uploadFile(path, file);
        
        // Update user profile photo URL in Firebase Auth
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            photoURL: downloadURL
          });
        }
        
        toast.success('प्रोफाइल फोटो अपडेट किया गया');
        
        // Force refresh to update UI
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error('Error uploading profile image:', error);
        toast.error('प्रोफाइल फोटो अपलोड करने में त्रुटि');
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-24"></div>
      <CardContent className="pt-0 relative">
        <div className="flex flex-col items-center -mt-12">
          <div className="relative w-24 h-24 rounded-full bg-white p-1 shadow-md">
            {photoURL ? (
              <img 
                src={photoURL} 
                alt={name} 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <div className="w-full h-full rounded-full bg-purple-100 flex items-center justify-center text-2xl font-bold text-purple-700">
                {name ? name.charAt(0) : 'S'}
              </div>
            )}
            
            <label htmlFor="profile-image" className="absolute bottom-0 right-0 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer border-2 border-white">
              <Upload className="h-3 w-3 text-white" />
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
            
            {uploading && (
              <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-bold mt-4">{name}</h2>
          
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 flex items-center gap-1">
              <Star className="h-3 w-3" />
              {points} पॉइंट्स
            </Badge>
            <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 flex items-center gap-1">
              <Award className="h-3 w-3" />
              Level {level}
            </Badge>
          </div>
          
          <div className="w-full mt-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">अगले लेवल तक</span>
              <span className="text-sm font-medium">{levelProgress}%</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 w-full gap-2 mt-6">
            <Button 
              variant="outline"
              className="flex items-center gap-2"
              onClick={copyProfileLink}
            >
              <LinkIcon className="h-4 w-4" />
              लिंक कॉपी करें
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={shareProfile}
            >
              <Share2 className="h-4 w-4" />
              शेयर करें
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileBanner;
