
import { ref, get, query, orderByChild, limitToFirst, onValue } from "firebase/database";
import { database } from './config';

// Get leaderboard data
export const getLeaderboardData = async (limit: number = 10) => {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const users: any[] = [];
    snapshot.forEach((childSnapshot) => {
      users.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    // Sort by points (and then by level if points are equal)
    users.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.level - a.level;
    });
    
    // Return only the top N users
    return users.slice(0, limit);
  } catch (error) {
    console.error("Error getting leaderboard data:", error);
    throw error;
  }
};

// Observe leaderboard data in real-time
export const observeLeaderboardData = (limit: number = 10, callback: (data: any[]) => void) => {
  const usersRef = ref(database, 'users');
  
  const unsubscribe = onValue(usersRef, (snapshot) => {
    if (snapshot.exists()) {
      const users: any[] = [];
      snapshot.forEach((childSnapshot) => {
        users.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      // Sort by points (and then by level if points are equal)
      users.sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        return b.level - a.level;
      });
      
      // Return only the top N users
      callback(users.slice(0, limit));
    } else {
      callback([]);
    }
  });
  
  return unsubscribe;
};
