import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
  const token = Cookies.get("framehub_token");
  
  if (!token) console.warn("⚠️ Atenção: Sem token de autenticação!");

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
};

export const backendService = {

  // COMENTÁRIOS
  getComments: async (crossoverId: string) => {
    const res = await fetch(`${API_URL}/api/comments/v2/comments/${crossoverId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  },

  addComment: async (crossoverId: string, content: string) => {
    const res = await fetch(`${API_URL}/api/comments/v2/comments`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ crossoverId, content }),
    });
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao comentar");
    }
    return res.json();
  },

  deleteComment: async (commentId: string) => {
    const res = await fetch(`${API_URL}/api/comments/v2/comments/${commentId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    
    if (!res.ok) throw new Error("Erro ao deletar comentário");
    return res.json();
  },

  updateComment: async (commentId: string, content: string) => {
    const res = await fetch(`${API_URL}/api/comments/v2/comments/${commentId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ content }),
    });
    
    if (!res.ok) throw new Error("Erro ao editar comentário");
    return res.json();
  },


  // SOCIAL
  getMe: async () => {
    const res = await fetch(`${API_URL}/api/auth/v2/me`, {
      method: "GET",
      headers: getHeaders(),
    });
    
    if (!res.ok) return null;
    return res.json();
  },

  getAllUsers: async () => {
    const res = await fetch(`${API_URL}/api/auth/v2/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }, 
    });
    
    if (!res.ok) return [];
    return res.json();
  },


  // FAVORITOS
  addFavorite: async (crossoverId: string) => {
    const url = `${API_URL}/api/favorites/v2/favorite`;
    console.log(`📡 Enviando POST para: ${url}`, { crossoverId });

    const res = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ crossoverId }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Erro desconhecido" }));
      console.error("❌ Erro Backend Favoritos:", res.status, errorData);
      throw new Error(errorData.message || `Erro ${res.status}: Falha ao favoritar`);
    }
    
    return res.json();
  },

  removeFavorite: async (crossoverId: string) => {
    const res = await fetch(`${API_URL}/api/favorites/v2/favorite`, {
      method: "DELETE",
      headers: getHeaders(),
      body: JSON.stringify({ crossoverId }),
    });
    if (!res.ok) throw new Error("Erro ao remover favorito");
    return res.json();
  },

  getMyFavorites: async () => {
    const res = await fetch(`${API_URL}/api/favorites/v2/favorite`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.favorites || json.data || []);
  },


  // HISTÓRICO
  addToHistory: async (crossoverId: string) => {
    const url = `${API_URL}/api/history/v2/history`;
    console.log(`📡 Enviando POST para: ${url}`, { crossoverId });

    const res = await fetch(url, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ crossoverId }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: "Erro desconhecido" }));
      console.error("❌ Erro Backend Histórico:", res.status, errorData);
      throw new Error(errorData.message || `Erro ${res.status}: Falha ao adicionar histórico`);
    }

    return res.json();
  },

  getMyHistory: async () => {
    const res = await fetch(`${API_URL}/api/history/v2/history`, {
      method: "GET",
      headers: getHeaders(),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.history || json.data || []);
  }
};