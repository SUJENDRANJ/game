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
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
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

  useEffect(() => {
    const fetchAchievements = async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAchievements(data.map(a => ({
          id: a.id,
          title: a.title,
          description: a.description,
          icon: a.icon,
          pointsReward: a.points_reward,
          category: a.category,
          rarity: a.rarity
        })));
      }
    };

    fetchAchievements();

    const achievementsChannel = supabase
      .channel('achievements-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'achievements' }, () => {
        fetchAchievements();
      })
      .subscribe();

    return () => {
      achievementsChannel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchRewards = async () => {
      const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRewards(data.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description,
          pointsCost: r.points_cost,
          category: r.category,
          imageUrl: r.image_url,
          stockQuantity: r.stock_quantity
        })));
      }
    };

    fetchRewards();

    const rewardsChannel = supabase
      .channel('rewards-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rewards' }, () => {
        fetchRewards();
      })
      .subscribe();

    return () => {
      rewardsChannel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchUserAchievements = async () => {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*');

      if (!error && data) {
        setUserAchievements(data.map(ua => ({
          id: ua.id,
          userId: ua.user_id,
          achievementId: ua.achievement_id,
          unlockedAt: new Date(ua.unlocked_at),
          awardedBy: ua.awarded_by
        })));
      }
    };

    fetchUserAchievements();

    const userAchievementsChannel = supabase
      .channel('user-achievements-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_achievements' }, () => {
        fetchUserAchievements();
      })
      .subscribe();

    return () => {
      userAchievementsChannel.unsubscribe();
    };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchRedemptions = async () => {
      const { data, error } = await supabase
        .from('reward_redemptions')
        .select('*')
        .order('redeemed_at', { ascending: false });

      if (!error && data) {
        setRedemptions(data.map(r => ({
          id: r.id,
          userId: r.user_id,
          rewardId: r.reward_id,
          pointsSpent: r.points_spent,
          status: r.status,
          redeemedAt: new Date(r.redeemed_at),
          fulfilledAt: r.fulfilled_at ? new Date(r.fulfilled_at) : undefined,
          fulfilledBy: r.fulfilled_by,
          notes: r.notes
        })));
      }
    };

    fetchRedemptions();

    const redemptionsChannel = supabase
      .channel('redemptions-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reward_redemptions' }, () => {
        fetchRedemptions();
      })
      .subscribe();

    return () => {
      redemptionsChannel.unsubscribe();
    };
  }, [currentUser]);

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

  const awardAchievement = async (userId: string, achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return;

    const alreadyUnlocked = userAchievements.some(
      ua => ua.userId === userId && ua.achievementId === achievementId
    );
    if (alreadyUnlocked) return;

    const { error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        awarded_by: currentUser?.id
      });

    if (!error) {
      awardPoints(userId, achievement.pointsReward, `Achievement unlocked: ${achievement.title}`);
    }
  };

  const redeemReward = async (userId: string, rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    const user = users.find(u => u.id === userId);

    if (!reward || !user || user.points < reward.pointsCost) return;

    const { error } = await supabase
      .from('reward_redemptions')
      .insert({
        user_id: userId,
        reward_id: rewardId,
        points_spent: reward.pointsCost,
        status: 'pending'
      });

    if (!error) {
      setUsers(prev => prev.map(u => {
        if (u.id === userId) {
          return { ...u, points: u.points - reward.pointsCost };
        }
        return u;
      }));

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
    }
  };

  const updateRedemptionStatus = async (redemptionId: string, status: RewardRedemption['status'], notes?: string) => {
    await supabase
      .from('reward_redemptions')
      .update({
        status,
        notes,
        fulfilled_at: status === 'fulfilled' ? new Date().toISOString() : undefined,
        fulfilled_by: status === 'fulfilled' ? currentUser?.id : undefined
      })
      .eq('id', redemptionId);
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
