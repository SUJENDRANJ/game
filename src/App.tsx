import { useState } from 'react';
import { useApp } from './context/AppContext';
import LoginScreen from './components/LoginScreen';
import EmployeeDashboard from './components/EmployeeDashboard';
import Leaderboard from './components/Leaderboard';
import RewardsMarketplace from './components/RewardsMarketplace';
import AchievementsPanel from './components/AchievementsPanel';
import AdminPanel from './components/AdminPanel';
import AdminNavbar from './components/AdminNavbar';
import CelebrationOverlay from './components/CelebrationOverlay';
import {
  LayoutDashboard,
  Trophy,
  ShoppingBag,
  Award,
  Shield,
  LogOut,
  Menu,
  X
} from 'lucide-react';

type Tab = 'dashboard' | 'leaderboard' | 'rewards' | 'achievements' | 'admin';

function App() {
  const { currentUser, logout, showCelebration, celebrationMessage } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) {
    return <LoginScreen />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, forRole: ['employee', 'admin'] },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, forRole: ['employee', 'admin'] },
    { id: 'achievements', label: 'Achievements', icon: Award, forRole: ['employee', 'admin'] },
    { id: 'rewards', label: 'Rewards', icon: ShoppingBag, forRole: ['employee', 'admin'] },
    { id: 'admin', label: 'Admin Panel', icon: Shield, forRole: ['admin'] },
  ] as const;

  const availableTabs = tabs.filter(tab => tab.forRole.includes(currentUser.role));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <CelebrationOverlay show={showCelebration} message={celebrationMessage} />

      {currentUser.role === 'admin' ? (
        <AdminNavbar adminName={currentUser.fullName} onLogout={logout} />
      ) : (
        <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-xl p-2 rounded-xl">
                  <Trophy className="w-8 h-8 text-yellow-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">Office Quest</h1>
                  <p className="text-xs text-white/80 font-semibold">Level {currentUser.level} • {currentUser.points} pts</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2">
                {availableTabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
                        activeTab === tab.id
                          ? 'bg-white text-purple-600 shadow-lg scale-105'
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="hidden lg:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <p className="text-white font-bold">{currentUser.fullName}</p>
                  <p className="text-white/80 text-sm capitalize">{currentUser.role}</p>
                </div>

                <button
                  onClick={logout}
                  className="hidden md:flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-bold transition-all hover:scale-105"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden lg:inline">Logout</span>
                </button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-white"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden pb-4 space-y-2">
                {availableTabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as Tab);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
                        activeTab === tab.id
                          ? 'bg-white text-purple-600'
                          : 'text-white bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-white/20 rounded-xl text-white font-bold"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <EmployeeDashboard />}
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'achievements' && <AchievementsPanel />}
        {activeTab === 'rewards' && <RewardsMarketplace />}
        {activeTab === 'admin' && currentUser.role === 'admin' && <AdminPanel />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p className="font-semibold">Office Quest - Gamified Office Management Platform</p>
            <p className="mt-1">Real-time sync • Instant updates • Game-inspired design</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
