
import { database } from '../firebase/config';
import { ref, get, onValue } from 'firebase/database';
import { LeaderboardUser } from './types';
import { generateBadges } from './badge-service';
import { getLastActiveText } from './utils';

// Convert Firebase user data to LeaderboardUser format
const transformUserData = (userId: string, userData: any, rank: number): LeaderboardUser => {
  // Calculate streak days from login streak data or use default value
  const streakKey = `${userId}_login_streak`;
  const streakDays = parseInt(localStorage.getItem(streakKey) || '0');

  // Calculate study hours from points (for example: 10 points = 1 hour)
  const studyHours = Math.floor((userData.points || 0) / 10);

  // Get recent activity timestamp
  const lastLoginTime = userData.lastLogin || userData.createdAt || Date.now();
  const lastActive = getLastActiveText(lastLoginTime);

  // Create badges based on achievements
  const badges = generateBadges(userData);

  return {
    id: userId,
    name: userData.displayName || userData.name || `User_${userId.substring(0, 5)}`,
    avatar: userData.photoURL || undefined,
    rank,
    xp: userData.points || 0,
    streakDays,
    studyHours,
    level: userData.level || 1,
    badges,
    lastActive
  };
};

// Get leaderboard data from Firebase
export const getLeaderboardData = async (): Promise<LeaderboardUser[]> => {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (!snapshot.exists()) {
      return [];
    }
    
    const users: any[] = [];
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      users.push({
        id: childSnapshot.key,
        ...userData
      });
    });
    
    // Sort by points (and then by level if points are equal)
    users.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.level - a.level;
    });
    
    // Transform to LeaderboardUser format with ranks
    return users.map((user, index) => transformUserData(user.id, user, index + 1));
  } catch (error) {
    console.error("Error getting leaderboard data:", error);
    return [];
  }
};

// Real-time leaderboard data listener
export const observeLeaderboardData = (callback: (data: LeaderboardUser[]) => void): (() => void) => {
  const usersRef = ref(database, 'users');
  
  const listener = onValue(usersRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([]);
      return;
    }
    
    const users: any[] = [];
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      users.push({
        id: childSnapshot.key,
        ...userData
      });
    });
    
    // Sort by points (and then by level if points are equal)
    users.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.level - a.level;
    });
    
    // Transform to LeaderboardUser format with ranks
    const transformedUsers = users.map((user, index) => 
      transformUserData(user.id, user, index + 1)
    );
    
    callback(transformedUsers);
  });
  
  return () => {
    // Return unsubscribe function
    // This is called when the component unmounts
    // to prevent memory leaks
    listener();
  };
};
