import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("framehub_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("framehub_refresh_token");
        if (!refreshToken) throw new Error("Sem refresh token");

        console.log("🔄 Axios: Tentando renovar token...");

        const { data } = await axios.post(`${API_URL}/api/auth/v2/refresh`, {
          refreshToken,
        });

        const newAccessToken = data.data?.accessToken || data.accessToken;
        const newRefreshToken = data.data?.refreshToken || data.refreshToken;

        if (newAccessToken) {
            const isProduction = process.env.NODE_ENV === 'production';
            Cookies.set("framehub_token", newAccessToken, { expires: 1, sameSite: 'Lax', secure: isProduction });
            
            if (newRefreshToken) {
                Cookies.set("framehub_refresh_token", newRefreshToken, { expires: 7, sameSite: 'Lax', secure: isProduction });
            }

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Sessão expirada.", refreshError);
        Cookies.remove("framehub_token");
        Cookies.remove("framehub_refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const backendService = {
  // ... (Mantenha todas as funções anteriores: addFavorite, getMe, etc.) ...
  addFavorite: async (crossoverId: string) => {
    const { data } = await api.post("/api/favorites/v2/favorite", { crossoverId });
    return data;
  },

  removeFavorite: async (crossoverId: string) => {
    const { data } = await api.delete("/api/favorites/v2/favorite", { data: { crossoverId } });
    return data;
  },

  getMyFavorites: async () => {
    try {
      const { data } = await api.get("/api/favorites/v2/favorite");
      return Array.isArray(data) ? data : (data.favorites || data.data || []);
    } catch { return []; }
  },

  addToWatchlist: async (crossoverId: string) => {
    const { data } = await api.post("/api/watchList/v2/watchlist", { crossoverId });
    return data;
  },

  removeFromWatchlist: async (crossoverId: string) => {
    const { data } = await api.delete("/api/watchList/v2/watchlist", { data: { crossoverId } });
    return data;
  },

  getMyWatchlist: async () => {
    try {
      const { data } = await api.get("/api/watchList/v2/watchlist");
      return Array.isArray(data) ? data : (data.watchlist || data.data || []);
    } catch { return []; }
  },

  getMe: async () => {
    try {
      const { data } = await api.get("/api/auth/v2/me");
      return data;
    } catch { return null; }
  },

  getAllUsers: async () => {
    try {
      const { data } = await api.get("/api/auth/v2/users");
      return data;
    } catch { return []; }
  },

  getUserById: async (userId: string) => {
    try {
      const { data } = await api.get("/api/auth/v2/users");
      return data.find((u: { id: string }) => u.id === userId) || null;
    } catch { return null; }
  },

  updateUser: async (userId: string, userData: { bio?: string; name?: string }) => {
    const { data } = await api.put(`/api/auth/v2/users/${userId}`, userData);
    return data;
  },

  searchUsers: async (query: string) => {
    try {
        const { data } = await api.get(`/api/auth/v2/getByName?name=${encodeURIComponent(query)}`);
        return data;
    } catch { return []; }
  },

  getMyFriends: async () => {
    try {
        const { data } = await api.get("/api/friends/v2/friends");
        return data;
    } catch { return []; }
  },

  getUserFriends: async (userId: string) => {
    try {
        const { data } = await api.get(`/api/friends/v2/list/${userId}`);
        return data;
    } catch { return []; }
  },

  followUser: async (friendId: string) => {
    const { data } = await api.post(`/api/friends/v2/friends/${friendId}`);
    return data;
  },

  unfollowUser: async (friendId: string) => {
    const { data } = await api.delete(`/api/friends/v2/friends/${friendId}`);
    return data;
  },

  getComments: async (crossoverId: string) => {
    try {
        const { data } = await api.get(`/api/comments/v2/comments/${crossoverId}`);
        return data;
    } catch { return []; }
  },

  addComment: async (crossoverId: string, content: string) => {
    const { data } = await api.post("/api/comments/v2/comments", { crossoverId, content });
    return data;
  },

  deleteComment: async (commentId: string) => {
    const { data } = await api.delete(`/api/comments/v2/comments/${commentId}`);
    return data;
  },

  updateComment: async (commentId: string, content: string) => {
    const { data } = await api.put(`/api/comments/v2/comments/${commentId}`, { content });
    return data;
  },

  
  getPublicFavorites: async (userId: string) => {
    try {
      const { data } = await api.get("/api/favorites/v2/publicFavorite", { params: { userId } });
      return Array.isArray(data) ? data : (data.favorites || data.data || []);
    } catch { return []; }
  },

  getPublicWatchlist: async (userId: string) => {
    try {
      const { data } = await api.get("/api/watchList/v2/publicWatchlist", { params: { userId } });
      return Array.isArray(data) ? data : (data.watchlist || data.data || []);
    } catch { return []; }
  },

  getPublicHistory: async (userId: string) => {
    try {
      const { data } = await api.get("/api/history/v2/publicHistory", { params: { userId } });
      return Array.isArray(data) ? data : (data.history || data.data || []);
    } catch { return []; }
  },

  getPublicFriends: async (userId: string) => {
    try {
      const { data } = await api.get("/api/friends/v2/publicFriends", { params: { userId } });
      return Array.isArray(data) ? data : [];
    } catch { return []; }
  }
};