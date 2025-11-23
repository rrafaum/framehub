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

  getMe: async () => {
    const res = await fetch(`${API_URL}/api/auth/v2/me`, {
      method: "GET",
      headers: getHeaders(),
    });
    
    if (!res.ok) return null;
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

  getAllUsers: async () => {
    const res = await fetch(`${API_URL}/api/auth/v2/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }, 
    });
    
    if (!res.ok) return [];
    return res.json();
  },
};