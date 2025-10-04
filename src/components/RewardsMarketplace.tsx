import { ShoppingBag, Clock, Gift, Sparkles, Star, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Reward } from '../types';

export default function RewardsMarketplace() {
  const { currentUser, rewards, redemptions, redeemReward } = useApp();

  const userRedemptions = redemptions.filter(r => r.userId === currentUser?.id);

  const categoryIcons = {
    time_off: Clock,
    perks: Star,
    swag: Gift,
    experiences: Sparkles
  };

  const categoryColors = {
    time_off: 'from-blue-500 to-blue-700',
    perks: 'from-purple-500 to-purple-700',
    swag: 'from-pink-500 to-pink-700',
    experiences: 'from-orange-500 to-red-600'
  };

  const canAfford = (reward: Reward) => {
    return currentUser && currentUser.points >= reward.pointsCost;
  };

  const handleRedeem = (reward: Reward) => {
    if (currentUser && canAfford(reward)) {
      if (confirm(`Redeem ${reward.title} for ${reward.pointsCost} points?`)) {
        redeemReward(currentUser.id, reward.id);
      }
    }
  };

  const groupedRewards = rewards.reduce((acc, reward) => {
    if (!acc[reward.category]) {
      acc[reward.category] = [];
    }
    acc[reward.category].push(reward);
    return acc;
  }, {} as Record<string, Reward[]>);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <ShoppingBag className="w-10 h-10" />
          <h2 className="text-3xl font-black">Rewards Marketplace</h2>
        </div>
        <p className="text-pink-100 text-lg mb-4">
          Exchange your hard-earned points for awesome rewards!
        </p>
        <div className="flex items-center gap-2 bg-white/20 rounded-xl px-6 py-3 backdrop-blur-sm w-fit">
          <Star className="w-6 h-6 text-yellow-300" />
          <span className="text-2xl font-black">{currentUser?.points || 0}</span>
          <span className="text-pink-100 font-semibold">points available</span>
        </div>
      </div>

      {userRedemptions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Check className="w-6 h-6 text-green-600" />
            Your Recent Redemptions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userRedemptions.slice(0, 4).map(redemption => {
              const reward = rewards.find(r => r.id === redemption.rewardId);
              if (!reward) return null;

              const statusColors = {
                pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                approved: 'bg-blue-100 text-blue-800 border-blue-300',
                fulfilled: 'bg-green-100 text-green-800 border-green-300',
                rejected: 'bg-red-100 text-red-800 border-red-300'
              };

              return (
                <div key={redemption.id} className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-gray-800">{reward.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[redemption.status]}`}>
                      {redemption.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Redeemed {new Date(redemption.redeemedAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {Object.entries(groupedRewards).map(([category, categoryRewards]) => {
        const Icon = categoryIcons[category as keyof typeof categoryIcons];
        const gradient = categoryColors[category as keyof typeof categoryColors];

        return (
          <div key={category}>
            <div className={`bg-gradient-to-r ${gradient} rounded-xl p-4 mb-4 shadow-md`}>
              <div className="flex items-center gap-2 text-white">
                <Icon className="w-6 h-6" />
                <h3 className="text-xl font-bold capitalize">
                  {category.replace('_', ' ')}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryRewards.map(reward => (
                <div
                  key={reward.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:scale-105 ${
                    canAfford(reward) ? 'hover:shadow-2xl' : 'opacity-75'
                  }`}
                >
                  <div className={`h-32 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                    <Icon className="w-16 h-16 text-white opacity-80" />
                  </div>

                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {reward.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {reward.description}
                    </p>

                    {reward.stockQuantity !== undefined && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Stock</span>
                          <span className="font-semibold text-gray-800">
                            {reward.stockQuantity} left
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all`}
                            style={{ width: `${Math.min((reward.stockQuantity / 30) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-2xl font-black text-gray-800">
                          {reward.pointsCost}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canAfford(reward)}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                          canAfford(reward)
                            ? `bg-gradient-to-r ${gradient} text-white hover:shadow-lg hover:scale-105`
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford(reward) ? 'Redeem' : 'Not Enough'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
