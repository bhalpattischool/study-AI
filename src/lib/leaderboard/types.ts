
export interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  rank: number;
  xp: number;
  streakDays: number;
  studyHours: number;
  level: number;
  badges: string[];
  lastActive: string;
}

export interface BadgeInfo {
  name: string;
  description: string;
  color: string;
}
