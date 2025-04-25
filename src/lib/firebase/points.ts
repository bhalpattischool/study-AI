
import { ref, get, onValue, set } from "firebase/database";
import { database } from './config';

export const getUserPoints = async (userId: string) => {
  const pointsRef = ref(database, `users/${userId}/points`);
  const snapshot = await get(pointsRef);
  return snapshot.exists() ? snapshot.val() : 0;
};

export const getUserLevel = async (userId: string) => {
  const levelRef = ref(database, `users/${userId}/level`);
  const snapshot = await get(levelRef);
  return snapshot.exists() ? snapshot.val() : 1;
};

export const observeUserPoints = (userId: string, callback: (points: number) => void) => {
  const pointsRef = ref(database, `users/${userId}/points`);
  return onValue(pointsRef, (snapshot) => {
    const points = snapshot.exists() ? snapshot.val() : 0;
    callback(points);
  });
};

export const observeUserLevel = (userId: string, callback: (level: number) => void) => {
  const levelRef = ref(database, `users/${userId}/level`);
  return onValue(levelRef, (snapshot) => {
    const level = snapshot.exists() ? snapshot.val() : 1;
    callback(level);
  });
};

export const addPointsToUserDb = async (userId: string, points: number, description: string, type: string) => {
  try {
    // Get current points
    const currentPoints = await getUserPoints(userId);
    const newTotalPoints = currentPoints + points;
    
    // Update points
    await set(ref(database, `users/${userId}/points`), newTotalPoints);
    
    // Calculate and update level (1 level per 100 points)
    const newLevel = Math.floor(newTotalPoints / 100) + 1;
    const currentLevel = await getUserLevel(userId);
    
    if (newLevel > currentLevel) {
      await set(ref(database, `users/${userId}/level`), newLevel);
      
      // Add level up bonus
      const levelUpRecord = {
        id: Date.now() + 1,
        type: 'achievement',
        points: 10,
        description: `लेवल ${newLevel} पर पहुंचने का बोनस`,
        timestamp: new Date().toISOString()
      };
      
      await set(ref(database, `users/${userId}/pointsHistory/${levelUpRecord.id}`), levelUpRecord);
      
      // Also add 10 more points for leveling up
      await set(ref(database, `users/${userId}/points`), newTotalPoints + 10);
    }
    
    // Add points record
    const pointRecord = {
      id: Date.now(),
      type,
      points,
      description,
      timestamp: new Date().toISOString()
    };
    
    await set(ref(database, `users/${userId}/pointsHistory/${pointRecord.id}`), pointRecord);
    
    return newTotalPoints;
  } catch (error) {
    console.error("Error adding points:", error);
    throw error;
  }
};

