
import { ref, get, onValue } from "firebase/database";
import { database } from './config';

export const getLeaderboardData = async () => {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const users = snapshot.val();
    const leaderboardData = Object.keys(users).map(userId => {
      const user = users[userId];
      return {
        id: userId,
        name: user.displayName || `Student_${userId.substring(0, 5)}`,
        points: user.points || 0,
        level: user.level || 1,
        photoURL: user.photoURL,
        rank: 0 // Will be calculated after sorting
      };
    });
    
    // Sort by points (descending)
    leaderboardData.sort((a, b) => b.points - a.points);
    
    // Assign ranks
    leaderboardData.forEach((student, index) => {
      student.rank = index + 1;
    });
    
    return leaderboardData;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return [];
  }
};

export const getUserPointsHistory = async (userId: string) => {
  try {
    const historyRef = ref(database, `users/${userId}/pointsHistory`);
    const snapshot = await get(historyRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const history = snapshot.val();
    return Object.values(history);
  } catch (error) {
    console.error("Error fetching points history:", error);
    return [];
  }
};

export const observeLeaderboardData = (callback: (data: any[]) => void) => {
  const usersRef = ref(database, 'users');
  return onValue(usersRef, async (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    
    const users = snapshot.val();
    const leaderboardData = Object.keys(users).map(userId => {
      const user = users[userId];
      return {
        id: userId,
        name: user.displayName || `Student_${userId.substring(0, 5)}`,
        points: user.points || 0,
        level: user.level || 1,
        photoURL: user.photoURL,
        rank: 0
      };
    });
    
    leaderboardData.sort((a, b) => b.points - a.points);
    
    leaderboardData.forEach((student, index) => {
      student.rank = index + 1;
    });
    
    callback(leaderboardData);
  });
};

