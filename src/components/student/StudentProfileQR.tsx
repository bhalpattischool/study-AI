
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProfileQRHeader from './profile-qr/ProfileQRHeader';
import QRCodeDisplay from './profile-qr/QRCodeDisplay';
import ProfileQRActions from './profile-qr/ProfileQRActions';
import { useStudentProfileData } from '@/hooks/useStudentProfileData';

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
  const {
    profileData,
    qrCodeUrl,
    profileUrl,
    downloadQRCode,
    shareProfile,
    copyProfileLink
  } = useStudentProfileData({
    currentUser,
    studentPoints,
    studentLevel
  });
  
  return (
    <Dialog>
      <DialogTrigger id="qr-dialog" className="hidden">Open QR</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">अपना प्रोफाइल शेयर करें</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <ProfileQRHeader 
            currentUser={currentUser} 
            studentPoints={studentPoints} 
            studentLevel={studentLevel} 
          />
          
          <QRCodeDisplay qrCodeUrl={qrCodeUrl} />
          
          <p className="text-sm text-center mt-4 text-gray-600">
            इस QR कोड को स्कैन करके अपने दोस्तों के साथ अपना अध्ययन प्रोफाइल शेयर करें
          </p>
          
          <ProfileQRActions 
            profileUrl={profileUrl}
            copyProfileLink={copyProfileLink}
            downloadQRCode={downloadQRCode}
            shareProfile={shareProfile}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileQR;
