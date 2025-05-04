
import { addPointsToUserDb } from '@/lib/firebase';
import { PointRecord } from './types';

export async function addPointsToUser(
  userId: string,
  points: number,
  type: PointRecord['type'],
  description: string
): Promise<void> {
  if (!userId) return;
  
  try {
    // Add points to Firebase DB
    await addPointsToUserDb(userId, points, description, type);
    
    // For backward compatibility, also update localStorage
    const currentPoints = parseInt(localStorage.getItem(`${userId}_points`) || '0');
    const newTotalPoints = currentPoints + points;
    
    // Update points
    localStorage.setItem(`${userId}_points`, newTotalPoints.toString());
    
    // Calculate and update level (1 level per 100 points)
    const newLevel = Math.floor(newTotalPoints / 100) + 1;
    const currentLevel = parseInt(localStorage.getItem(`${userId}_level`) || '1');
    
    if (newLevel > currentLevel) {
      localStorage.setItem(`${userId}_level`, newLevel.toString());
      
      // Add level up record and bonus points
      addPointRecord(userId, {
        id: Date.now() + 1,
        type: 'achievement',
        points: 10,
        description: `लेवल ${newLevel} पर पहुंचने का बोनस`,
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem(`${userId}_points`, (newTotalPoints + 10).toString());
      
      // Also update Firebase for level up bonus
      try {
        await addPointsToUserDb(userId, 10, `लेवल ${newLevel} पर पहुंचने का बोनस`, 'achievement');
      } catch (error) {
        console.error("Error updating Firebase for level up:", error);
      }
    }
    
    // Add points record
    addPointRecord(userId, {
      id: Date.now(),
      type,
      points,
      description,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in addPointsToUser:", error);
    handlePointsError(userId, points, type, description);
  }
}

function handlePointsError(userId: string, points: number, type: PointRecord['type'], description: string) {
  // Fallback to localStorage if Firebase fails
  const currentPoints = parseInt(localStorage.getItem(`${userId}_points`) || '0');
  const newTotalPoints = currentPoints + points;
  
  localStorage.setItem(`${userId}_points`, newTotalPoints.toString());
  
  const newLevel = Math.floor(newTotalPoints / 100) + 1;
  const currentLevel = parseInt(localStorage.getItem(`${userId}_level`) || '1');
  
  if (newLevel > currentLevel) {
    localStorage.setItem(`${userId}_level`, newLevel.toString());
    addPointRecord(userId, {
      id: Date.now() + 1,
      type: 'achievement',
      points: 10,
      description: `लेवल ${newLevel} पर पहुंचने का बोनस`,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem(`${userId}_points`, (newTotalPoints + 10).toString());
  }
  
  addPointRecord(userId, {
    id: Date.now(),
    type,
    points,
    description,
    timestamp: new Date().toISOString()
  });
}

export function addPointRecord(userId: string, record: PointRecord): void {
  if (!userId) return;
  
  const historyKey = `${userId}_points_history`;
  const existingHistory = localStorage.getItem(historyKey);
  
  const history = existingHistory ? JSON.parse(existingHistory) : [];
  history.push(record);
  
  localStorage.setItem(historyKey, JSON.stringify(history));
}
