
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
    let bonusPoints = 5; // Increased base login bonus
    let streakMessage = '';
    
    if (lastLoginDate && lastLoginDate === yesterdayDate) {
      newStreak = currentStreak + 1;
      localStorage.setItem(streakKey, newStreak.toString());
      
      if (newStreak % 7 === 0) {
        bonusPoints += 15; // Increased weekly streak bonus
        streakMessage = ` (${newStreak} दिन की स्ट्रीक बोनस!)`;
      } else if (newStreak % 3 === 0) {
        bonusPoints += 10; // Increased 3-day streak bonus
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
    
    // Try to update streak info in Firebase database
    try {
      const { getDatabase, ref, update } = await import('firebase/database');
      const { database } = await import('@/lib/firebase/config');
      
      const userRef = ref(database, `users/${userId}`);
      await update(userRef, {
        streak: newStreak,
        longestStreak: Math.max(newStreak, currentLongestStreak)
      });
    } catch (error) {
      console.error("Failed to update streak in Firebase:", error);
      // Continue using localStorage as fallback
    }
    
    return true;
  }
  
  return false;
}

// Add a new function to award points for completing study sessions
export async function addStudySessionPoints(
  userId: string, 
  minutes: number, 
  subject: string
): Promise<void> {
  if (!userId || minutes <= 0) return;
  
  // Base points calculation - 1 point per 5 minutes studied
  const basePoints = Math.floor(minutes / 5);
  
  // Bonus for longer sessions
  let bonusPoints = 0;
  let message = `${minutes} मिनट का अध्ययन पूरा किया`;
  
  if (minutes >= 60) {
    bonusPoints = 10; // Bonus for 1+ hour sessions
    message = `${minutes} मिनट का लंबा अध्ययन सत्र पूरा किया!`;
  } else if (minutes >= 30) {
    bonusPoints = 5; // Bonus for 30+ minute sessions
  }
  
  const totalPoints = basePoints + bonusPoints;
  
  // Add subject to message if provided
  if (subject && subject.trim() !== '') {
    message = `${subject}: ${message}`;
  }
  
  await addPointsToUser(userId, totalPoints, 'activity', message);
}
