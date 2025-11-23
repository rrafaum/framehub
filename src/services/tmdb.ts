const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

const fetchFromTMDB = async (endpoint: string, params: string = "") => {
  if (!API_KEY || !BASE_URL) return null;
  try {
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR${params}`);
    if (!res.ok) throw new Error(`Erro TMDB: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchQuietly = async (endpoint: string) => {
    try {
        const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR`);
        if (!res.ok) return null; 
        return await res.json();
    } catch {
        return null;
    }
};

export const tmdbService = {
  searchMulti: async (query: string) => fetchFromTMDB("/search/multi", `&query=${encodeURIComponent(query)}`),

  searchMovies: async (query: string) => fetchFromTMDB("/search/movie", `&query=${encodeURIComponent(query)}`),

  searchSeries: async (query: string) => fetchFromTMDB("/search/tv", `&query=${encodeURIComponent(query)}`),

  getTrending: async (type: 'all' | 'movie' | 'tv' = 'all') => fetchFromTMDB(`/trending/${type}/week`),

  getDetails: async (id: number, type: 'movie' | 'tv') => fetchFromTMDB(`/${type}/${id}`),

  getPopular: async (type: 'movie' | 'tv', page: number = 1) => fetchFromTMDB(`/${type}/popular`, `&page=${page}`),
  
  getTopRated: async (type: 'movie' | 'tv', page: number = 1) => fetchFromTMDB(`/${type}/top_rated`, `&page=${page}`),

  getMediaById: async (id: string | number) => {
    const movie = await fetchQuietly(`/movie/${id}`);
    if (movie && movie.id) {
        return { ...movie, media_type: 'movie' };
    }
    
    const tv = await fetchQuietly(`/tv/${id}`);
    if (tv && tv.id) {
        return { ...tv, media_type: 'tv' };
    }

    console.warn(`⚠️ ID ${id} não encontrado nem como Filme nem como Série.`);
    return null;
  }
};