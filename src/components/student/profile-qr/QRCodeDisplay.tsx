
import React from 'react';
import { User } from 'lucide-react';

interface QRCodeDisplayProps {
  qrCodeUrl: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCodeUrl }) => {
  if (!qrCodeUrl) {
    return (
      <div className="w-60 h-60 border p-2 rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
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
  );
};

export default QRCodeDisplay;
