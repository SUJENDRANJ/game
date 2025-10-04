import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Achievement, Reward, PointTransaction, OfficeRule, UserAchievement, RewardRedemption } from '../types';
import { mockUsers, mockAchievements, mockRewards, mockOfficeRules, mockUserAchievements } from '../data/mockData';
import { supabase } from '../lib/supabase';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  rewards: Reward[];
  redemptions: RewardRedemption[];
  transactions: PointTransaction[];
  officeRules: OfficeRule[];
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  awardPoints: (userId: string, amount: number, description: string) => void;
  awardAchievement: (userId: string, achievementId: string) => void;
  redeemReward: (userId: string, rewardId: string) => void;
  updateRedemptionStatus: (redemptionId: string, status: RewardRedemption['status'], notes?: string) => void;
  deleteEmployee: (userId: string) => Promise<void>;
  showCelebration: boolean;
  celebrationMessage: string;
  triggerCelebration: (message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userEmail = session.user.email!;

        const mockUser = mockUsers.find(u => u.email === userEmail);
        if (mockUser) {
          setCurrentUser(mockUser);
          localStorage.setItem('currentUser', JSON.stringify(mockUser));
        } else {
          setUsers(prev => {
            const existingUser = prev.find(u => u.email === userEmail);
            if (existingUser) {
              setCurrentUser(existingUser);
              localStorage.setItem('currentUser', JSON.stringify(existingUser));
              return prev;
            }
            const newUser: User = {
              id: session.user.id,
              email: userEmail,
              fullName: session.user.user_metadata?.full_name || userEmail.split('@')[0],
              role: userEmail === 'admin@gmail.com' ? 'admin' : 'employee',
              points: 0,
              totalPointsEarned: 0,
              level: 1,
              streakDays: 0
            };
            setCurrentUser(newUser);
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            return [...prev, newUser];
          });
        }
      } else {
        localStorage.removeItem('currentUser');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          const userEmail = session.user.email!;

          const mockUser = mockUsers.find(u => u.email === userEmail);
          if (mockUser) {
            setCurrentUser(mockUser);
            localStorage.setItem('currentUser', JSON.stringify(mockUser));
          } else {
            setUsers(prev => {
              const existingUser = prev.find(u => u.email === userEmail);
              if (existingUser) {
                setCurrentUser(existingUser);
                localStorage.setItem('currentUser', JSON.stringify(existingUser));
                return prev;
              }
              const newUser: User = {
                id: session.user.id,
                email: userEmail,
                fullName: session.user.user_metadata?.full_name || userEmail.split('@')[0],
                role: userEmail === 'admin@gmail.com' ? 'admin' : 'employee',
                points: 0,
                totalPointsEarned: 0,
                level: 1,
                streakDays: 0
              };
              setCurrentUser(newUser);
              localStorage.setItem('currentUser', JSON.stringify(newUser));
              return [...prev, newUser];
            });
          }
        } else {
          setCurrentUser(null);
          localStorage.removeItem('currentUser');
        }
      })();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    }
  }, [users]);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      const mockUser = mockUsers.find(u => u.email === email);
      if (mockUser) {
        setCurrentUser(mockUser);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
      } else {
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
          setCurrentUser(existingUser);
          localStorage.setItem('currentUser', JSON.stringify(existingUser));
        } else {
          const newUser: User = {
            id: data.user.id,
            email: data.user.email!,
            fullName: data.user.user_metadata?.full_name || email.split('@')[0],
            role: email === 'admin@gmail.com' ? 'admin' : 'employee',
            points: 0,
            totalPointsEarned: 0,
            level: 1,
            streakDays: 0
          };
          setCurrentUser(newUser);
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          setUsers(prev => [...prev, newUser]);
        }
      }
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        },
        emailRedirectTo: undefined
      }
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      const newUser: User = {
        id: data.user.id,
        email: data.user.email!,
        fullName,
        role: email === 'admin@gmail.com' ? 'admin' : 'employee',
        points: 0,
        totalPointsEarned: 0,
        level: 1,
        streakDays: 0
      };
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setUsers(prev => [...prev, newUser]);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
      triggerCelebration(`${amount > 0 ? '+' : ''}${amount} points! ${description}`);
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
      triggerCelebration(`Reward redeemed: ${reward.title}`);
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

  const deleteEmployee = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (mockUsers.find(u => u.id === userId)) {
      throw new Error('Cannot delete demo users');
    }

    setUsers(prev => prev.filter(u => u.id !== userId));
    setUserAchievements(prev => prev.filter(ua => ua.userId !== userId));
    setRedemptions(prev => prev.filter(r => r.userId !== userId));
    setTransactions(prev => prev.filter(t => t.userId !== userId));

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting user from auth:', error);
    }
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
      signup,
      logout,
      awardPoints,
      awardAchievement,
      redeemReward,
      updateRedemptionStatus,
      deleteEmployee,
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
