
/**
 * Utility functions for the student points system
 */

export interface PointRecord {
  id: number;
  type: 'goal' | 'task' | 'activity' | 'login' | 'streak' | 'achievement' | 'quiz';
  points: number;
  description: string;
  timestamp: string;
}

/**
 * Add points to a user and update their level
 */
export function addPointsToUser(
  userId: string,
  points: number,
  type: PointRecord['type'],
  description: string
): void {
  if (!userId) return;
  
  // Get current points
  const currentPoints = parseInt(localStorage.getItem(`${userId}_points`) || '0');
  const newTotalPoints = currentPoints + points;
  
  // Update points
  localStorage.setItem(`${userId}_points`, newTotalPoints.toString());
  
  // Calculate and update level (1 level per 100 points)
  const newLevel = Math.floor(newTotalPoints / 100) + 1;
  const currentLevel = parseInt(localStorage.getItem(`${userId}_level`) || '1');
  
  if (newLevel > currentLevel) {
    localStorage.setItem(`${userId}_level`, newLevel.toString());
    
    // Add level up record
    addPointRecord(userId, {
      id: Date.now() + 1, // Ensure unique ID
      type: 'achievement',
      points: 10, // Bonus for leveling up
      description: `लेवल ${newLevel} पर पहुंचने का बोनस`,
      timestamp: new Date().toISOString()
    });
    
    // Also add 10 more points for leveling up
    localStorage.setItem(`${userId}_points`, (newTotalPoints + 10).toString());
  }
  
  // Add points record
  addPointRecord(userId, {
    id: Date.now(),
    type,
    points,
    description,
    timestamp: new Date().toISOString()
  });
}

/**
 * Add a point record to the user's history
 */
export function addPointRecord(userId: string, record: PointRecord): void {
  if (!userId) return;
  
  const historyKey = `${userId}_points_history`;
  const existingHistory = localStorage.getItem(historyKey);
  
  const history = existingHistory ? JSON.parse(existingHistory) : [];
  history.push(record);
  
  localStorage.setItem(historyKey, JSON.stringify(history));
}

/**
 * Award daily login bonus
 */
export function awardDailyLoginBonus(userId: string): boolean {
  if (!userId) return false;
  
  const lastLoginKey = `${userId}_last_login`;
  const lastLogin = localStorage.getItem(lastLoginKey);
  const today = new Date().toDateString();
  
  // If no login today, give bonus
  if (lastLogin !== today) {
    localStorage.setItem(lastLoginKey, today);
    
    // Check if this is a streak
    const streakKey = `${userId}_login_streak`;
    const currentStreak = parseInt(localStorage.getItem(streakKey) || '0');
    const lastLoginDate = lastLogin ? new Date(lastLogin) : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = 1;
    let bonusPoints = 2; // Base login bonus
    let streakMessage = '';
    
    // If yesterday was the last login, it's a streak
    if (lastLoginDate && lastLoginDate.toDateString() === yesterday.toDateString()) {
      newStreak = currentStreak + 1;
      localStorage.setItem(streakKey, newStreak.toString());
      
      // Extra points for streaks
      if (newStreak % 7 === 0) {
        // Weekly streak bonus
        bonusPoints += 10;
        streakMessage = ` (${newStreak} दिन की स्ट्रीक बोनस!)`;
      } else if (newStreak % 3 === 0) {
        // 3-day streak bonus
        bonusPoints += 5;
        streakMessage = ` (${newStreak} दिन की स्ट्रीक)`;
      } else {
        streakMessage = ` (${newStreak} दिन की स्ट्रीक)`;
      }
    } else {
      // Reset streak
      localStorage.setItem(streakKey, '1');
    }
    
    // Add login points
    addPointsToUser(
      userId, 
      bonusPoints, 
      'login', 
      `दैनिक लॉगिन${streakMessage}`
    );
    
    return true;
  }
  
  return false;
}

/**
 * Add quiz completion points
 */
export function addQuizCompletionPoints(
  userId: string, 
  correctAnswers: number, 
  totalQuestions: number
): void {
  if (!userId) return;
  
  // Calculate percentage
  const percentage = (correctAnswers / totalQuestions) * 100;
  let points = 5; // Base points
  let message = 'क्विज पूरा किया';
  
  // Bonus points based on performance
  if (percentage === 100) {
    points = 15;
    message = 'क्विज में पूर्ण अंक प्राप्त किए';
  } else if (percentage >= 80) {
    points = 10;
    message = 'क्विज में उत्कृष्ट प्रदर्शन';
  }
  
  addPointsToUser(userId, points, 'quiz', message);
}

/**
 * Add chapter completion points
 */
export function addChapterCompletionPoints(userId: string, chapterName: string): void {
  if (!userId) return;
  
  const key = `${userId}_chapter_${chapterName.replace(/\s+/g, '_')}`;
  
  // Check if already awarded
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, 'completed');
    addPointsToUser(userId, 10, 'activity', `${chapterName} अध्याय पूरा किया`);
  }
}
