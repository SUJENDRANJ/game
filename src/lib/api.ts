const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let token: string | null = localStorage.getItem('token');

export const setAuthToken = (newToken: string | null) => {
  token = newToken;
  if (newToken) {
    localStorage.setItem('token', newToken);
  } else {
    localStorage.removeItem('token');
  }
};

const getHeaders = () => {
  const headers: any = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setAuthToken(data.token);
      return data;
    },
    register: async (email: string, password: string, name: string) => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setAuthToken(data.token);
      return data;
    },
    logout: () => {
      setAuthToken(null);
    },
  },
  achievements: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/api/achievements`);
      return response.json();
    },
    create: async (achievement: any) => {
      const response = await fetch(`${API_URL}/api/achievements`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(achievement),
      });
      return response.json();
    },
    award: async (achievementId: string, userId: string) => {
      const response = await fetch(`${API_URL}/api/achievements/award/${achievementId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userId }),
      });
      return response.json();
    },
    delete: async (achievementId: string) => {
      const response = await fetch(`${API_URL}/api/achievements/${achievementId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response.json();
    },
  },
  rewards: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/api/rewards`);
      return response.json();
    },
    create: async (reward: any) => {
      const response = await fetch(`${API_URL}/api/rewards`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(reward),
      });
      return response.json();
    },
    purchase: async (rewardId: string) => {
      const response = await fetch(`${API_URL}/api/rewards/purchase/${rewardId}`, {
        method: 'POST',
        headers: getHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    },
    delete: async (rewardId: string) => {
      const response = await fetch(`${API_URL}/api/rewards/${rewardId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return response.json();
    },
  },
  leaderboard: {
    get: async () => {
      const response = await fetch(`${API_URL}/api/leaderboard`);
      return response.json();
    },
  },
};
