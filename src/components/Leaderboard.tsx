import { Trophy, Crown, Medal, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Leaderboard() {
  const { users, currentUser } = useApp();

  const rankedUsers = [...users]
    .filter(u => u.role === 'employee')
    .sort((a, b) => b.totalPointsEarned - a.totalPointsEarned)
    .map((user, index) => ({ ...user, rank: index + 1 }));

  const currentUserRank = rankedUsers.find(u => u.id === currentUser?.id);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-400" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 3:
        return <Medal className="w-8 h-8 text-orange-400" />;
      default:
        return <Trophy className="w-6 h-6 text-gray-400" />;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white scale-105';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
      case 3:
        return 'bg-gradient-to-r from-orange-300 to-orange-400 text-gray-800';
      default:
        return 'bg-white text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-10 h-10" />
          <h2 className="text-3xl font-black">Leaderboard</h2>
        </div>
        <p className="text-purple-100 text-lg">
          Compete with colleagues and climb to the top!
        </p>
      </div>

      {currentUserRank && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-blue-100 text-sm font-semibold">Your Rank</p>
                <p className="text-3xl font-black">#{currentUserRank.rank}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm font-semibold">Total Points</p>
              <p className="text-3xl font-black">{currentUserRank.totalPointsEarned}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Top Performers</h3>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {rankedUsers.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-6 rounded-2xl shadow-md transition-all hover:scale-105 ${getRankBg(user.rank)} ${
                  user.id === currentUser?.id ? 'ring-4 ring-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-16">
                    {getRankIcon(user.rank)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-bold">{user.fullName}</h4>
                      {user.id === currentUser?.id && (
                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${user.rank <= 3 ? 'text-current opacity-80' : 'text-gray-500'}`}>
                      Level {user.level} • {user.streakDays} day streak
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <Trophy className={`w-5 h-5 ${user.rank <= 3 ? 'text-current' : 'text-yellow-500'}`} />
                    <span className="text-3xl font-black">
                      {user.totalPointsEarned}
                    </span>
                  </div>
                  <p className={`text-sm ${user.rank <= 3 ? 'text-current opacity-80' : 'text-gray-500'}`}>
                    {user.points} available
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
        <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Pro Tip
        </h3>
        <p className="text-green-800">
          Complete achievements and maintain your streak to earn bonus points and climb the leaderboard faster!
        </p>
      </div>
    </div>
  );
}
