import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
  const token = Cookies.get("framehub_token");
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : "", 
  };
};

const refreshSession = async () => {
    const refreshToken = Cookies.get("framehub_refresh_token");
    
    if (!refreshToken) {
        return null;
    }

    try {
        const res = await fetch(`${API_URL}/api/auth/v2/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });

        if (!res.ok) return null;

        const data = await res.json();
        const newAccessToken = data.data?.accessToken || data.accessToken || data.token;
        const newRefreshToken = data.data?.refreshToken || data.refreshToken;

        if (!newAccessToken) return null;

        console.log("✅ Token renovado nos bastidores!");

        const isProduction = process.env.NODE_ENV === 'production';

        Cookies.set("framehub_token", newAccessToken, { 
            expires: 1, 
            sameSite: 'Lax', 
            secure: isProduction 
        });
        
        if (newRefreshToken) {
            Cookies.set("framehub_refresh_token", newRefreshToken, { 
                expires: 7, 
                sameSite: 'Lax', 
                secure: isProduction 
            });
        }

        return newAccessToken;
    } catch (error) {
        console.error("Erro crítico ao renovar token:", error);
        return null;
    }
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let res = await fetch(url, { ...options, headers: getHeaders() });

    if (res.status === 401) {
        const newToken = await refreshSession();

        if (newToken) {
            res = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${newToken}`
                }
            });
        } else {
            console.warn("Sessão expirada definitivamente.");
            Cookies.remove("framehub_token");
            Cookies.remove("framehub_refresh_token");
            window.location.href = "/login";
        }
    }

    return res;
};

export const backendService = {
  
  addFavorite: async (crossoverId: string) => {
    const res = await fetchWithAuth(`${API_URL}/api/favorites/v2/favorite`, {
      method: "POST",
      body: JSON.stringify({ crossoverId }),
    });
    if (!res.ok) throw new Error("Erro ao favoritar");
    return res.json();
  },
  
  removeFavorite: async (crossoverId: string) => {
    const res = await fetchWithAuth(`${API_URL}/api/favorites/v2/favorite`, { method: "DELETE", body: JSON.stringify({ crossoverId }) });
    if (!res.ok) throw new Error("Erro ao remover");
    return res.json();
  },

  getMyFavorites: async () => {
    const res = await fetchWithAuth(`${API_URL}/api/favorites/v2/favorite`, { method: "GET" });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.favorites || json.data || []);
  },

  addToHistory: async (crossoverId: string) => {
    const res = await fetchWithAuth(`${API_URL}/api/history/v2/history`, { method: "POST", body: JSON.stringify({ crossoverId }) });
    if (!res.ok) throw new Error("Erro ao adicionar histórico");
    return res.json();
  },

  getMyHistory: async () => {
    const res = await fetchWithAuth(`${API_URL}/api/history/v2/history`, { method: "GET" });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.history || json.data || []);
  },

  removeFromHistory: async (crossoverId: string) => {
    const res = await fetchWithAuth(`${API_URL}/api/history/v2/history`, {
      method: "DELETE",
      body: JSON.stringify({ crossoverId }),
    });
    if (!res.ok) throw new Error("Erro ao remover do histórico");
    return res.json();
  },

  getMe: async () => {
    const res = await fetchWithAuth(`${API_URL}/api/auth/v2/me`, { method: "GET", cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  },

  getAllUsers: async () => {
    const res = await fetchWithAuth(`${API_URL}/api/auth/v2/users`, { method: "GET", cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  },

  updateUser: async (userId: string, data: { bio?: string; name?: string }) => {
    const res = await fetchWithAuth(`${API_URL}/api/auth/v2/users/${userId}`, { method: "PUT", body: JSON.stringify(data) });
    if (!res.ok) throw new Error("Erro ao atualizar");
    return res.json();
  },


  // Comentários
  getComments: async (crossoverId: string) => {
    const res = await fetchWithAuth(`${API_URL}/api/comments/v2/comments/${crossoverId}`, { method: "GET" });
    if (!res.ok) return [];
    return res.json();
  },

  addComment: async (crossoverId: string, content: string) => {
    const res = await fetchWithAuth(`${API_URL}/api/comments/v2/comments`, { method: "POST", body: JSON.stringify({ crossoverId, content }) });
    if (!res.ok) throw new Error("Erro ao comentar");
    return res.json();
  },

  deleteComment: async (commentId: string) => {
    const res = await fetchWithAuth(`${API_URL}/api/comments/v2/comments/${commentId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao deletar");
    return res.json();
  },

  updateComment: async (commentId: string, content: string) => {
    const res = await fetchWithAuth(`${API_URL}/api/comments/v2/comments/${commentId}`, { method: "PUT", body: JSON.stringify({ content }) });
    if (!res.ok) throw new Error("Erro ao editar");
    return res.json();
  },
};