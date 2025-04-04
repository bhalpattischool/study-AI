
import QRCode from 'qrcode';

/**
 * Generate a QR code from profile data
 */
export const generateProfileQRCode = async (
  profileData: any, 
  profileLink: string
): Promise<string> => {
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
    
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('QR कोड जनरेट करने में समस्या आई');
  }
};
