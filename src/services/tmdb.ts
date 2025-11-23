const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

const fetchFromTMDB = async (endpoint: string, params: string = "") => {
  if (!API_KEY || !BASE_URL) {
    console.error("TMDB: Chave de API ou Base URL não configuradas no .env.local");
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR${params}`);
    
    if (!res.ok) throw new Error(`Erro TMDB: ${res.statusText}`);
    
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const tmdbService = {
  searchMulti: async (query: string) => {
    return fetchFromTMDB("/search/multi", `&query=${encodeURIComponent(query)}`);
  },

  searchMovies: async (query: string) => {
    return fetchFromTMDB("/search/movie", `&query=${encodeURIComponent(query)}`);
  },

  searchSeries: async (query: string) => {
    return fetchFromTMDB("/search/tv", `&query=${encodeURIComponent(query)}`);
  },

  getTrending: async (type: 'all' | 'movie' | 'tv' = 'all') => {
    return fetchFromTMDB(`/trending/${type}/week`);
  },

  getPopular: async (type: 'movie' | 'tv', page: number = 1) => {
    return fetchFromTMDB(`/${type}/popular`, `&page=${page}`);
  },

  getTopRated: async (type: 'movie' | 'tv', page: number = 1) => {
    return fetchFromTMDB(`/${type}/top_rated`, `&page=${page}`);
  },

  getDetails: async (id: number, type: 'movie' | 'tv') => {
    return fetchFromTMDB(`/${type}/${id}`);
  },
};