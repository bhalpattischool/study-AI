
import { ref, push, set, get, query, orderByChild, limitToLast } from "firebase/database";
import { database } from './config';

// Add points to a user
export const addPointsToUserDb = async (userId: string, points: number, reason: string, type?: string) => {
  try {
    // Get current points
    const userPointsRef = ref(database, `users/${userId}`);
    const snapshot = await get(userPointsRef);
    
    if (!snapshot.exists()) {
      throw new Error("User not found");
    }
    
    const userData = snapshot.val();
    const currentPoints = userData.points || 0;
    const currentLevel = userData.level || 1;
    
    // Calculate new level (simple algorithm, can be made more complex)
    let newLevel = currentLevel;
    const pointsForNextLevel = currentLevel * 100; // Example: level 1 = 100 points, level 2 = 200 points
    
    if (currentPoints + points >= pointsForNextLevel) {
      newLevel = currentLevel + 1;
    }
    
    // Update user's points and level
    await set(ref(database, `users/${userId}`), {
      ...userData,
      points: currentPoints + points,
      level: newLevel
    });
    
    // Add to points history
    const historyRef = ref(database, `points_history/${userId}`);
    await push(historyRef, {
      points,
      reason,
      type: type || 'activity', // Default to 'activity' if no type is provided
      timestamp: Date.now(),
      newTotal: currentPoints + points,
      levelUp: newLevel > currentLevel
    });
    
    return {
      previousPoints: currentPoints,
      newPoints: currentPoints + points,
      previousLevel: currentLevel,
      newLevel,
      leveledUp: newLevel > currentLevel
    };
  } catch (error) {
    console.error("Error adding points:", error);
    throw error;
  }
};

// Get user's point history
export const getUserPointsHistory = async (userId: string, limit: number = 20) => {
  try {
    const historyRef = query(
      ref(database, `points_history/${userId}`),
      orderByChild('timestamp'),
      limitToLast(limit)
    );
    
    const snapshot = await get(historyRef);
    if (!snapshot.exists()) {
      return [];
    }
    
    const history: any[] = [];
    snapshot.forEach((item) => {
      history.push({
        id: item.key,
        ...item.val()
      });
    });
    
    // Sort by timestamp (newest first)
    return history.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error getting points history:", error);
    throw error;
  }
};
