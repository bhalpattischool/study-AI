
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from 'lucide-react';
import { toast } from "sonner";
import { uploadProfileImage } from '@/lib/firebase';

interface ProfileHeaderProps {
  currentUser: any;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ currentUser }) => {
  const [uploading, setUploading] = useState(false);

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

  return (
    <div className="flex flex-col items-center -mt-12 mb-6">
      <div className="relative">
        <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white dark:border-gray-800">
          {currentUser?.photoURL ? (
            <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
          ) : (
            <AvatarFallback className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 text-lg">
              {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          )}
        </Avatar>
        
        <label htmlFor="profile-image" className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer border-2 border-white dark:border-gray-800">
          <Upload className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
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
            <div className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
      
      <h2 className="mt-4 text-lg sm:text-xl font-semibold text-gray-900 dark:text-white break-words max-w-full text-center px-2">
        {currentUser?.displayName || 'User'}
      </h2>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words max-w-full text-center px-2">
        {currentUser?.email}
      </p>
    </div>
  );
};

export default ProfileHeader;
