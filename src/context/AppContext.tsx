import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Achievement, Reward, PointTransaction, OfficeRule, UserAchievement, RewardRedemption } from '../types';
import { mockUsers, mockAchievements, mockRewards, mockOfficeRules, mockUserAchievements } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  rewards: Reward[];
  redemptions: RewardRedemption[];
  transactions: PointTransaction[];
  officeRules: OfficeRule[];
  login: (email: string) => void;
  logout: () => void;
  awardPoints: (userId: string, amount: number, description: string) => void;
  awardAchievement: (userId: string, achievementId: string) => void;
  redeemReward: (userId: string, rewardId: string) => void;
  updateRedemptionStatus: (redemptionId: string, status: RewardRedemption['status'], notes?: string) => void;
  showCelebration: boolean;
  celebrationMessage: string;
  triggerCelebration: (message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [achievements] = useState<Achievement[]>(mockAchievements);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(mockUserAchievements);
  const [rewards] = useState<Reward[]>(mockRewards);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [officeRules] = useState<OfficeRule[]>(mockOfficeRules);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
  }, [users, currentUser]);

  const login = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const triggerCelebration = (message: string) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const awardPoints = (userId: string, amount: number, description: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          points: user.points + amount,
          totalPointsEarned: user.totalPointsEarned + amount,
          level: Math.floor((user.totalPointsEarned + amount) / 100) + 1
        };
      }
      return user;
    }));

    const newTransaction: PointTransaction = {
      id: Date.now().toString(),
      userId,
      amount,
      type: 'admin_award',
      description,
      awardedBy: currentUser?.id,
      createdAt: new Date()
    };
    setTransactions(prev => [newTransaction, ...prev]);

    if (userId === currentUser?.id) {
      triggerCelebration(`+${amount} points! ${description}`);
    }
  };

  const awardAchievement = (userId: string, achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return;

    const alreadyUnlocked = userAchievements.some(
      ua => ua.userId === userId && ua.achievementId === achievementId
    );
    if (alreadyUnlocked) return;

    const newUserAchievement: UserAchievement = {
      id: Date.now().toString(),
      userId,
      achievementId,
      unlockedAt: new Date(),
      awardedBy: currentUser?.id
    };
    setUserAchievements(prev => [...prev, newUserAchievement]);

    awardPoints(userId, achievement.pointsReward, `Achievement unlocked: ${achievement.title}`);
  };

  const redeemReward = (userId: string, rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    const user = users.find(u => u.id === userId);

    if (!reward || !user || user.points < reward.pointsCost) return;

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, points: u.points - reward.pointsCost };
      }
      return u;
    }));

    const newRedemption: RewardRedemption = {
      id: Date.now().toString(),
      userId,
      rewardId,
      pointsSpent: reward.pointsCost,
      status: 'pending',
      redeemedAt: new Date()
    };
    setRedemptions(prev => [newRedemption, ...prev]);

    const newTransaction: PointTransaction = {
      id: (Date.now() + 1).toString(),
      userId,
      amount: -reward.pointsCost,
      type: 'redemption',
      description: `Redeemed: ${reward.title}`,
      createdAt: new Date()
    };
    setTransactions(prev => [newTransaction, ...prev]);

    if (userId === currentUser?.id) {
      triggerCelebration(`🎁 ${reward.title} redeemed!`);
    }
  };

  const updateRedemptionStatus = (redemptionId: string, status: RewardRedemption['status'], notes?: string) => {
    setRedemptions(prev => prev.map(r => {
      if (r.id === redemptionId) {
        return {
          ...r,
          status,
          notes,
          fulfilledAt: status === 'fulfilled' ? new Date() : r.fulfilledAt,
          fulfilledBy: status === 'fulfilled' ? currentUser?.id : r.fulfilledBy
        };
      }
      return r;
    }));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      achievements,
      userAchievements,
      rewards,
      redemptions,
      transactions,
      officeRules,
      login,
      logout,
      awardPoints,
      awardAchievement,
      redeemReward,
      updateRedemptionStatus,
      showCelebration,
      celebrationMessage,
      triggerCelebration
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
