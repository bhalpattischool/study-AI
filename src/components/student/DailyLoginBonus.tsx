
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "lucide-react";
import { motion } from "framer-motion";

interface DailyLoginBonusProps {
  userId: string;
  points: number;
  streakDays: number;
}

const DailyLoginBonus: React.FC<DailyLoginBonusProps> = ({ userId, points, streakDays }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bonusAlreadyShown, setBonusAlreadyShown] = useState(false);
  
  useEffect(() => {
    const bonusShownKey = `${userId}_bonus_shown_${new Date().toDateString()}`;
    const bonusShown = localStorage.getItem(bonusShownKey);
    
    if (!bonusShown && points > 0) {
      setIsOpen(true);
      localStorage.setItem(bonusShownKey, 'true');
      setBonusAlreadyShown(true);
    } else {
      setBonusAlreadyShown(true);
    }
  }, [userId, points]);
  
  if (bonusAlreadyShown && !isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl">
            दैनिक लॉगिन बोनस मिला!
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center">
          <div className="relative mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20 
              }}
              className="h-24 w-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center"
            >
              <span className="text-3xl font-bold text-purple-600 dark:text-purple-300">
                +{points}
              </span>
            </motion.div>
            {streakDays > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-medium flex items-center"
              >
                <Confetti className="h-3 w-3 mr-1" />
                {streakDays} दिन की स्ट्रीक!
              </motion.div>
            )}
          </div>
          
          <p className="text-center text-muted-foreground mb-4">
            आज लॉगिन करने के लिए आपको {points} पॉइंट्स मिले हैं।
            {streakDays > 1 && ` आपकी ${streakDays} दिन की स्ट्रीक चल रही है!`}
          </p>
          
          <Button onClick={() => setIsOpen(false)}>
            धन्यवाद!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyLoginBonus;
