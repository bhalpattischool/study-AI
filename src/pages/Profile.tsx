
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser, uploadProfileImage, auth } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { LogOut, Upload, User, Book, Sparkles } from 'lucide-react';

const Profile = () => {
  const { currentUser, isLoading } = useAuth();
  const [userCategory, setUserCategory] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate('/login');
    }
    
    // Get user data from localStorage
    if (currentUser) {
      setUserCategory(localStorage.getItem('userCategory') || '');
      setEducationLevel(localStorage.getItem('educationLevel') || '');
    }
  }, [currentUser, isLoading, navigate]);

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentUser) {
      const file = e.target.files[0];
      
      try {
        setUploading(true);
        await uploadProfileImage(currentUser.uid, file);
        toast.success("Profile image updated successfully!");
        
        // Force refresh to update UI
        window.location.reload();
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to update profile image");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-950 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">My Profile</h1>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col items-center -mt-12 mb-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-800">
                  {currentUser?.photoURL ? (
                    <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
                  ) : (
                    <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 text-lg">
                      {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <label htmlFor="profile-image" className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer border-2 border-white dark:border-gray-800">
                  <Upload className="h-4 w-4 text-white" />
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                  disabled={uploading}
                />
                
                {uploading && (
                  <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {currentUser?.displayName || 'User'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentUser?.email}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-gray-700/50 rounded-lg">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
                  <User className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {userCategory ? userCategory.charAt(0).toUpperCase() + userCategory.slice(1) : 'Not specified'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-gray-700/50 rounded-lg">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
                  <Book className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Education Level</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {educationLevel ? educationLevel.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline"
            className="text-sm"
            onClick={() => navigate('/')}
          >
            <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
            Return to Study AI
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
