import { useState } from "react";
import {
  Shield,
  Award,
  Users,
  Gift,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  Crown,
  Medal,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AdminPanel() {
  const { users, achievements, awardAchievement } = useApp();
  const [selectedUser, setSelectedUser] = useState("");
  const [pointAmount, setPointAmount] = useState("");
  const [pointDescription, setPointDescription] = useState("");
  const [selectedAchievement, setSelectedAchievement] = useState("");

  const employees = (users || []).filter((u) => u.role === "employee");
  const pendingRedemptions: any[] = [];

  const rankedUsers = [...(users || [])]
    .filter((u) => u.role === "employee")
    .sort((a, b) => b.totalPointsEarned - a.totalPointsEarned)
    .map((user, index) => ({ ...user, rank: index + 1 }));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return <Trophy className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleAwardPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && pointAmount && pointDescription) {
      alert("Points feature coming soon!");
      setSelectedUser("");
      setPointAmount("");
      setPointDescription("");
    }
  };

  const handleAwardAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && selectedAchievement) {
      awardAchievement(selectedUser, selectedAchievement);
      setSelectedUser("");
      setSelectedAchievement("");
      alert("Achievement awarded successfully!");
    }
  };

  const handleRedemption = (
    redemptionId: string,
    status: "approved" | "fulfilled" | "rejected"
  ) => {
    alert("Redemption feature coming soon!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-10 h-10" />
          <h2 className="text-3xl font-black">Admin Control Panel</h2>
        </div>
        <p className="text-indigo-100 text-lg">
          Manage points, awards, and reward redemptions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
          <Users className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-black mb-1">{employees.length}</p>
          <p className="text-blue-100 font-semibold">Total Employees</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
          <Award className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-black mb-1">
            {(achievements || []).length}
          </p>
          <p className="text-purple-100 font-semibold">Active Achievements</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <AlertCircle className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-black mb-1">
            {pendingRedemptions.length}
          </p>
          <p className="text-orange-100 font-semibold">Pending Redemptions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Gift className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Award Points</h3>
          </div>

          <form onSubmit={handleAwardPoints} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Employee
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                required
              >
                <option value="">Choose an employee...</option>
                {(employees || []).map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} (Level {user.level} - {user.points} pts)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Points Amount
              </label>
              <input
                type="number"
                value={pointAmount}
                onChange={(e) => setPointAmount(e.target.value)}
                placeholder="Enter points (e.g., 50)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={pointDescription}
                onChange={(e) => setPointDescription(e.target.value)}
                placeholder="Why are they receiving points?"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all"
            >
              Award Points
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">
              Grant Achievement
            </h3>
          </div>

          <form onSubmit={handleAwardAchievement} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Employee
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none transition-all"
                required
              >
                <option value="">Choose an employee...</option>
                {(employees || []).map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Achievement
              </label>
              <select
                value={selectedAchievement}
                onChange={(e) => setSelectedAchievement(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none transition-all"
                required
              >
                <option value="">Choose an achievement...</option>
                {(achievements || []).map((achievement) => (
                  <option key={achievement.id} value={achievement.id}>
                    {achievement.title} (+{achievement.pointsReward} pts)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all"
            >
              Grant Achievement
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-yellow-600" />
          <h3 className="text-xl font-bold text-gray-800">
            Employee Leaderboard
          </h3>
        </div>

        <div className="space-y-3">
          {rankedUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                user.rank <= 3
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center w-12">
                  {getRankIcon(user.rank)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-gray-800">
                      {user.fullName}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        user.rank === 1
                          ? "bg-yellow-400 text-yellow-900"
                          : user.rank === 2
                          ? "bg-gray-300 text-gray-800"
                          : user.rank === 3
                          ? "bg-orange-300 text-orange-900"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      #{user.rank}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Level {user.level} • {user.streakDays} day streak •{" "}
                    {user.points} pts available
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  <span className="text-2xl font-black text-gray-800">
                    {user.totalPointsEarned}
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-semibold">
                  Total Earned
                </p>
              </div>
            </div>
          ))}
        </div>

        {rankedUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No employees found
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
        <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Admin Tips
        </h3>
        <ul className="text-green-800 space-y-1 text-sm">
          <li>• Award points instantly to recognize great work</li>
          <li>• Grant achievements to celebrate milestones</li>
          <li>• Process redemptions quickly to keep employees engaged</li>
          <li>• Updates are reflected in real-time across all devices</li>
        </ul>
      </div>
    </div>
  );
}
