import { User, Achievement, Reward, PointTransaction, OfficeRule, UserAchievement } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'sarah.chen@company.com',
    fullName: 'Sarah Chen',
    role: 'employee',
    points: 850,
    totalPointsEarned: 2450,
    level: 25,
    streakDays: 12
  },
  {
    id: '2',
    email: 'mike.rodriguez@company.com',
    fullName: 'Mike Rodriguez',
    role: 'employee',
    points: 620,
    totalPointsEarned: 2180,
    level: 22,
    streakDays: 8
  },
  {
    id: '3',
    email: 'admin@company.com',
    fullName: 'Admin User',
    role: 'admin',
    points: 0,
    totalPointsEarned: 0,
    level: 1,
    streakDays: 0
  },
  {
    id: '4',
    email: 'emma.wilson@company.com',
    fullName: 'Emma Wilson',
    role: 'employee',
    points: 1200,
    totalPointsEarned: 3450,
    level: 35,
    streakDays: 25
  },
  {
    id: '5',
    email: 'james.park@company.com',
    fullName: 'James Park',
    role: 'employee',
    points: 480,
    totalPointsEarned: 1580,
    level: 16,
    streakDays: 5
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: 'a1',
    title: 'Early Bird',
    description: 'Arrive before 9 AM for 5 consecutive days',
    icon: 'sunrise',
    pointsReward: 50,
    category: 'compliance',
    rarity: 'common',
    isActive: true
  },
  {
    id: 'a2',
    title: 'Team Player',
    description: 'Help 3 colleagues complete their tasks',
    icon: 'users',
    pointsReward: 100,
    category: 'teamwork',
    rarity: 'rare',
    isActive: true
  },
  {
    id: 'a3',
    title: 'Safety Champion',
    description: 'Complete all safety protocols for 30 days',
    icon: 'shield',
    pointsReward: 200,
    category: 'compliance',
    rarity: 'epic',
    isActive: true
  },
  {
    id: 'a4',
    title: 'Innovation Star',
    description: 'Submit 5 improvement suggestions',
    icon: 'lightbulb',
    pointsReward: 150,
    category: 'special',
    rarity: 'rare',
    isActive: true
  },
  {
    id: 'a5',
    title: 'Perfect Week',
    description: 'Complete all tasks perfectly for a week',
    icon: 'star',
    pointsReward: 300,
    category: 'milestone',
    rarity: 'legendary',
    isActive: true
  },
  {
    id: 'a6',
    title: 'Clean Desk Master',
    description: 'Maintain perfect desk organization for 10 days',
    icon: 'archive',
    pointsReward: 75,
    category: 'compliance',
    rarity: 'common',
    isActive: true
  }
];

export const mockUserAchievements: UserAchievement[] = [
  {
    id: 'ua1',
    userId: '1',
    achievementId: 'a1',
    unlockedAt: new Date('2025-09-28'),
    awardedBy: '3'
  },
  {
    id: 'ua2',
    userId: '1',
    achievementId: 'a2',
    unlockedAt: new Date('2025-09-30'),
    awardedBy: '3'
  },
  {
    id: 'ua3',
    userId: '4',
    achievementId: 'a5',
    unlockedAt: new Date('2025-10-01'),
    awardedBy: '3'
  }
];

export const mockRewards: Reward[] = [
  {
    id: 'r1',
    title: 'Half Day Off',
    description: 'Enjoy a free afternoon off with full pay',
    pointsCost: 500,
    category: 'time_off',
    stockQuantity: 10,
    isAvailable: true
  },
  {
    id: 'r2',
    title: 'Premium Parking Spot',
    description: 'Reserved parking spot for one month',
    pointsCost: 300,
    category: 'perks',
    stockQuantity: 3,
    isAvailable: true
  },
  {
    id: 'r3',
    title: 'Company Hoodie',
    description: 'Premium branded hoodie in your size',
    pointsCost: 200,
    category: 'swag',
    stockQuantity: 25,
    isAvailable: true
  },
  {
    id: 'r4',
    title: 'Team Lunch',
    description: 'Catered lunch for your team (up to 8 people)',
    pointsCost: 800,
    category: 'experiences',
    stockQuantity: 5,
    isAvailable: true
  },
  {
    id: 'r5',
    title: 'Wireless Headphones',
    description: 'Premium noise-canceling headphones',
    pointsCost: 1000,
    category: 'swag',
    stockQuantity: 8,
    isAvailable: true
  },
  {
    id: 'r6',
    title: 'Full Day Off',
    description: 'Complete day off with full pay',
    pointsCost: 900,
    category: 'time_off',
    stockQuantity: 15,
    isAvailable: true
  },
  {
    id: 'r7',
    title: 'Coffee Card',
    description: '$50 gift card to local coffee shop',
    pointsCost: 150,
    category: 'perks',
    isAvailable: true
  },
  {
    id: 'r8',
    title: 'VIP Event Ticket',
    description: 'Ticket to company VIP event',
    pointsCost: 1200,
    category: 'experiences',
    stockQuantity: 4,
    isAvailable: true
  }
];

export const mockOfficeRules: OfficeRule[] = [
  {
    id: 'or1',
    title: 'Safety First',
    description: 'Always wear proper safety equipment in designated areas',
    pointsValue: 10,
    category: 'Safety',
    isActive: true
  },
  {
    id: 'or2',
    title: 'Punctuality',
    description: 'Arrive on time for all scheduled shifts and meetings',
    pointsValue: 5,
    category: 'Attendance',
    isActive: true
  },
  {
    id: 'or3',
    title: 'Clean Workspace',
    description: 'Keep your workspace organized and clean',
    pointsValue: 5,
    category: 'Compliance',
    isActive: true
  },
  {
    id: 'or4',
    title: 'Quality Standards',
    description: 'Meet or exceed all quality control standards',
    pointsValue: 15,
    category: 'Performance',
    isActive: true
  }
];
