import { useState } from 'react';
import { Shield, Award, Users, Gift, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminPanel() {
  const { users, achievements, redemptions, awardPoints, awardAchievement, updateRedemptionStatus } = useApp();
  const [selectedUser, setSelectedUser] = useState('');
  const [pointAmount, setPointAmount] = useState('');
  const [pointDescription, setPointDescription] = useState('');
  const [selectedAchievement, setSelectedAchievement] = useState('');

  const employees = users.filter(u => u.role === 'employee');
  const pendingRedemptions = redemptions.filter(r => r.status === 'pending');

  const handleAwardPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && pointAmount && pointDescription) {
      awardPoints(selectedUser, parseInt(pointAmount), pointDescription);
      setSelectedUser('');
      setPointAmount('');
      setPointDescription('');
      alert('Points awarded successfully!');
    }
  };

  const handleAwardAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser && selectedAchievement) {
      awardAchievement(selectedUser, selectedAchievement);
      setSelectedUser('');
      setSelectedAchievement('');
      alert('Achievement awarded successfully!');
    }
  };

  const handleRedemption = (redemptionId: string, status: 'approved' | 'fulfilled' | 'rejected') => {
    const notes = prompt(`Add notes for this ${status} action (optional):`);
    updateRedemptionStatus(redemptionId, status, notes || undefined);
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
          <p className="text-3xl font-black mb-1">{achievements.length}</p>
          <p className="text-purple-100 font-semibold">Active Achievements</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <AlertCircle className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-black mb-1">{pendingRedemptions.length}</p>
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
                {employees.map(user => (
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
            <h3 className="text-xl font-bold text-gray-800">Grant Achievement</h3>
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
                {employees.map(user => (
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
                {achievements.map(achievement => (
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

      {pendingRedemptions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold text-gray-800">Pending Redemptions</h3>
          </div>

          <div className="space-y-4">
            {pendingRedemptions.map(redemption => {
              const user = users.find(u => u.id === redemption.userId);
              const reward = useApp().rewards.find(r => r.id === redemption.rewardId);

              if (!user || !reward) return null;

              return (
                <div key={redemption.id} className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">{reward.title}</h4>
                      <p className="text-sm text-gray-600">
                        Requested by {user.fullName} • {new Date(redemption.redeemedAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-semibold text-purple-600 mt-1">
                        {redemption.pointsSpent} points spent
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold border border-yellow-300">
                      PENDING
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleRedemption(redemption.id, 'approved')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRedemption(redemption.id, 'fulfilled')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Fulfill
                    </button>
                    <button
                      onClick={() => handleRedemption(redemption.id, 'rejected')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
