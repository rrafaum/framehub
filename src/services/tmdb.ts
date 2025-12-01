import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "pt-BR",
  },
});

const fetchFromTMDB = async (endpoint: string, extraParams: Record<string, string | number> = {}) => {
  try {
    const { data } = await tmdbApi.get(endpoint, { params: extraParams });
    return data;
  } catch (error) {
    console.error(`Erro TMDB [${endpoint}]:`, error);
    return null;
  }
};

const fetchQuietly = async (endpoint: string) => {
  try {
    const { data } = await tmdbApi.get(endpoint);
    return data;
  } catch {
    return null;
  }
};

export const tmdbService = {
  searchMulti: (query: string) => fetchFromTMDB("/search/multi", { query }),
  searchMovies: (query: string) => fetchFromTMDB("/search/movie", { query }),
  searchSeries: (query: string) => fetchFromTMDB("/search/tv", { query }),
  
  getTrending: (type: 'all' | 'movie' | 'tv' = 'all') => fetchFromTMDB(`/trending/${type}/week`),
  getDetails: (id: number, type: 'movie' | 'tv') => fetchFromTMDB(`/${type}/${id}`),
  getPopular: (type: 'movie' | 'tv', page: number = 1) => fetchFromTMDB(`/${type}/popular`, { page }),
  getTopRated: (type: 'movie' | 'tv', page: number = 1) => fetchFromTMDB(`/${type}/top_rated`, { page }),

  getMediaById: async (id: string | number) => {
    const movie = await fetchQuietly(`/movie/${id}`);
    if (movie && movie.id) return { ...movie, media_type: 'movie' };
    
    const tv = await fetchQuietly(`/tv/${id}`);
    if (tv && tv.id) return { ...tv, media_type: 'tv' };

    return null;
  }
};