
import { addPointsToUser } from './core';

export async function awardDailyLoginBonus(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  const lastLoginKey = `${userId}_last_login`;
  const lastLogin = localStorage.getItem(lastLoginKey);
  const today = new Date().toDateString();
  
  if (lastLogin !== today) {
    localStorage.setItem(lastLoginKey, today);
    
    const streakKey = `${userId}_login_streak`;
    const currentStreak = parseInt(localStorage.getItem(streakKey) || '0');
    const lastLoginDate = lastLogin ? new Date(lastLogin) : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = 1;
    let bonusPoints = 2; // Base login bonus
    let streakMessage = '';
    
    if (lastLoginDate && lastLoginDate.toDateString() === yesterday.toDateString()) {
      newStreak = currentStreak + 1;
      localStorage.setItem(streakKey, newStreak.toString());
      
      if (newStreak % 7 === 0) {
        bonusPoints += 10;
        streakMessage = ` (${newStreak} दिन की स्ट्रीक बोनस!)`;
      } else if (newStreak % 3 === 0) {
        bonusPoints += 5;
        streakMessage = ` (${newStreak} दिन की स्ट्रीक)`;
      } else {
        streakMessage = ` (${newStreak} दिन की स्ट्रीक)`;
      }
    } else {
      localStorage.setItem(streakKey, '1');
    }
    
    await addPointsToUser(
      userId, 
      bonusPoints, 
      'login', 
      `दैनिक लॉगिन${streakMessage}`
    );
    
    return true;
  }
  
  return false;
}
