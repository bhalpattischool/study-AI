
// Mock leaderboard service with sample data

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

// Mock leaderboard data
export const getLeaderboardData = (): LeaderboardUser[] => {
  return [
    {
      id: '1',
      name: 'Raj Sharma',
      avatar: 'https://i.pravatar.cc/150?img=11',
      rank: 1,
      xp: 15750,
      streakDays: 42,
      studyHours: 256,
      level: 21,
      badges: ['math-wizard', 'science-master', 'study-marathon'],
      lastActive: '2 घंटे पहले'
    },
    {
      id: '2',
      name: 'Priya Patel',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rank: 2,
      xp: 14320,
      streakDays: 36,
      studyHours: 231,
      level: 19,
      badges: ['literature-buff', 'history-expert', 'consistent-learner'],
      lastActive: '10 मिनट पहले'
    },
    {
      id: '3',
      name: 'Vikram Singh',
      avatar: 'https://i.pravatar.cc/150?img=12',
      rank: 3,
      xp: 13890,
      streakDays: 29,
      studyHours: 215,
      level: 18,
      badges: ['physics-genius', 'quiz-champion'],
      lastActive: '5 मिनट पहले'
    },
    {
      id: '4',
      name: 'Ananya Gupta',
      avatar: 'https://i.pravatar.cc/150?img=9',
      rank: 4,
      xp: 12450,
      streakDays: 25,
      studyHours: 189,
      level: 17,
      badges: ['chemistry-master', 'early-bird'],
      lastActive: 'आज'
    },
    {
      id: '5',
      name: 'Rohan Mehta',
      avatar: 'https://i.pravatar.cc/150?img=15',
      rank: 5,
      xp: 11930,
      streakDays: 21,
      studyHours: 178,
      level: 16,
      badges: ['biology-expert', 'night-owl'],
      lastActive: 'कल'
    },
    {
      id: '6',
      name: 'Neha Verma',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rank: 6,
      xp: 10850,
      streakDays: 19,
      studyHours: 160,
      level: 15,
      badges: ['geography-pro', 'quick-learner'],
      lastActive: '30 मिनट पहले'
    },
    {
      id: '7',
      name: 'Arjun Kumar',
      avatar: 'https://i.pravatar.cc/150?img=17',
      rank: 7,
      xp: 9750,
      streakDays: 15,
      studyHours: 148,
      level: 14,
      badges: ['computer-genius', 'problem-solver'],
      lastActive: 'आज'
    },
    {
      id: '8',
      name: 'Divya Reddy',
      avatar: 'https://i.pravatar.cc/150?img=24',
      rank: 8,
      xp: 8930,
      streakDays: 14,
      studyHours: 133,
      level: 13,
      badges: ['language-expert', 'dedicated-student'],
      lastActive: '1 घंटे पहले'
    },
    {
      id: '9',
      name: 'Aditya Joshi',
      avatar: 'https://i.pravatar.cc/150?img=20',
      rank: 9,
      xp: 7890,
      streakDays: 12,
      studyHours: 118,
      level: 11,
      badges: ['economics-master', 'rising-star'],
      lastActive: 'कल'
    },
    {
      id: '10',
      name: 'Meera Shah',
      avatar: 'https://i.pravatar.cc/150?img=23',
      rank: 10,
      xp: 6950,
      streakDays: 9,
      studyHours: 102,
      level: 10,
      badges: ['art-enthusiast', 'team-player'],
      lastActive: '3 घंटे पहले'
    },
  ];
};

// Get user badges with descriptions
export const getBadgeInfo = (badgeId: string) => {
  const badges: Record<string, { name: string, description: string, color: string }> = {
    'math-wizard': { 
      name: 'गणित विज़ार्ड', 
      description: '100 से अधिक गणित प्रश्न हल किए', 
      color: 'blue' 
    },
    'science-master': { 
      name: 'विज्ञान मास्टर', 
      description: 'विज्ञान में उत्कृष्ट प्रदर्शन', 
      color: 'green' 
    },
    'study-marathon': { 
      name: 'अध्ययन मैराथन', 
      description: 'एक दिन में 8 घंटे से अधिक अध्ययन किया', 
      color: 'purple' 
    },
    'literature-buff': { 
      name: 'साहित्य प्रेमी', 
      description: '50 से अधिक साहित्य क्विज पूरे किए', 
      color: 'amber' 
    },
    'history-expert': { 
      name: 'इतिहास विशेषज्ञ', 
      description: 'इतिहास विषय में विशेष ज्ञान', 
      color: 'brown' 
    },
    'consistent-learner': { 
      name: 'नियमित अध्येता', 
      description: '30 दिन की अध्ययन स्ट्रीक', 
      color: 'teal' 
    },
    'physics-genius': { 
      name: 'भौतिकी प्रतिभा', 
      description: 'भौतिकी में उत्कृष्ट प्रदर्शन', 
      color: 'indigo' 
    },
    'quiz-champion': { 
      name: 'क्विज चैम्पियन', 
      description: '25 क्विज में 90% से अधिक स्कोर', 
      color: 'orange' 
    },
    'chemistry-master': { 
      name: 'रसायन मास्टर', 
      description: 'रसायन विज्ञान में विशेषज्ञता', 
      color: 'rose' 
    },
    'early-bird': { 
      name: 'अर्ली बर्ड', 
      description: '20 बार सुबह 6 बजे से पहले अध्ययन शुरू किया', 
      color: 'yellow' 
    },
    'biology-expert': { 
      name: 'जीव विज्ञान विशेषज्ञ', 
      description: 'जीव विज्ञान में उच्च ज्ञान', 
      color: 'emerald' 
    },
    'night-owl': { 
      name: 'नाइट आउल', 
      description: '15 बार रात 12 बजे के बाद अध्ययन किया', 
      color: 'slate' 
    },
    'geography-pro': { 
      name: 'भूगोल प्रो', 
      description: 'भूगोल में उत्कृष्ट प्रदर्शन', 
      color: 'cyan' 
    },
    'quick-learner': { 
      name: 'त्वरित शिक्षार्थी', 
      description: 'नए विषयों को तेजी से समझने की क्षमता', 
      color: 'pink' 
    },
    'computer-genius': { 
      name: 'कंप्यूटर जीनियस', 
      description: 'प्रोग्रामिंग और कंप्यूटर विज्ञान में विशेषज्ञता', 
      color: 'sky' 
    },
    'problem-solver': { 
      name: 'समस्या समाधानकर्ता', 
      description: '100 से अधिक जटिल समस्याएं हल कीं', 
      color: 'red' 
    },
    'language-expert': { 
      name: 'भाषा विशेषज्ञ', 
      description: 'कई भाषाओं में प्रवीणता', 
      color: 'violet' 
    },
    'dedicated-student': { 
      name: 'समर्पित विद्यार्थी', 
      description: '500 घंटे से अधिक अध्ययन पूरा किया', 
      color: 'lime' 
    },
    'economics-master': { 
      name: 'अर्थशास्त्र मास्टर', 
      description: 'अर्थशास्त्र में विशेषज्ञता', 
      color: 'fuchsia' 
    },
    'rising-star': { 
      name: 'उभरता सितारा', 
      description: 'प्रगति की तेज गति', 
      color: 'amber' 
    },
    'art-enthusiast': { 
      name: 'कला प्रेमी', 
      description: 'कला और डिजाइन में रुचि और कौशल', 
      color: 'purple' 
    },
    'team-player': { 
      name: 'टीम प्लेयर', 
      description: '10 से अधिक सामूहिक अध्ययन सत्रों में भाग लिया', 
      color: 'green' 
    },
  };
  
  return badges[badgeId] || { name: 'अज्ञात बैज', description: 'बैज विवरण उपलब्ध नहीं है', color: 'gray' };
};

// Get badge icon based on badge ID
export const getBadgeIcon = (badgeId: string) => {
  // This would ideally return the correct icon path based on the badge ID
  // For now, we're returning a simple placeholder
  return badgeId;
};
