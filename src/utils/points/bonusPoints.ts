
import { addPointsToUser } from './core';

export async function awardDailyLoginBonus(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  const lastLoginKey = `${userId}_last_login`;
  const lastLoginDateKey = `${userId}_last_login_date`;
  const lastLogin = localStorage.getItem(lastLoginKey);
  const lastLoginDate = localStorage.getItem(lastLoginDateKey);
  const today = new Date().toDateString();
  const todayDate = new Date().toISOString().split('T')[0];
  
  if (lastLogin !== today) {
    localStorage.setItem(lastLoginKey, today);
    localStorage.setItem(lastLoginDateKey, todayDate);
    
    const streakKey = `${userId}_login_streak`;
    const currentStreak = parseInt(localStorage.getItem(streakKey) || '0');
    const lastLoginObj = lastLoginDate ? new Date(lastLoginDate) : null;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split('T')[0];
    
    let newStreak = 1;
    let bonusPoints = 2; // Base login bonus
    let streakMessage = '';
    
    if (lastLoginDate && lastLoginDate === yesterdayDate) {
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
    
    // Update longest streak if needed
    const longestStreakKey = `${userId}_longest_streak`;
    const currentLongestStreak = parseInt(localStorage.getItem(longestStreakKey) || '0');
    if (newStreak > currentLongestStreak) {
      localStorage.setItem(longestStreakKey, newStreak.toString());
    }
    
    return true;
  }
  
  return false;
}
