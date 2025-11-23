
"use client";

import { useState, useEffect } from "react";
import { backendService } from "@/services/backend";
import { tmdbService } from "@/services/tmdb";
import { MovieCard } from "@/components/MovieCard/MovieCard";
import HorizontalScroll from "@/components/HorizontalScroll/HorizontalScroll";
import styles from "./HomeUserLists.module.css";

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: 'movie' | 'tv';
  vote_average: number;
  overview: string;
}

type RawBackendItem = string | number | {
  crossoverId?: string | number;
  id?: string | number;
  movieId?: string | number;
  [key: string]: unknown;
};

export default function HomeUserLists() {
  const [favoritesList, setFavoritesList] = useState<MediaItem[]>([]);
  const [historyList, setHistoryList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rawFavs, rawHist] = await Promise.all([
          backendService.getMyFavorites(),
          backendService.getMyHistory()
        ]);

        const normalizeIds = (list: unknown): string[] => {
            if (!Array.isArray(list)) return [];
            return list.map((item: RawBackendItem) => {
                if (typeof item === 'string' || typeof item === 'number') return String(item);
                if (typeof item === 'object' && item !== null) {
                    const id = item.crossoverId || item.id || item.movieId;
                    return id ? String(id) : "";
                }
                return "";
            }).filter(id => id !== ""); 
        };

        const favIds = normalizeIds(rawFavs).reverse();
        const histIds = normalizeIds(rawHist).reverse();

        const fetchDetails = async (ids: string[]) => {
            const uniqueIds = Array.from(new Set(ids));
            const promises = uniqueIds.map(id => tmdbService.getMediaById(id));
            const results = await Promise.all(promises);
            return results.filter(Boolean) as MediaItem[];
        };

        const [favs, hist] = await Promise.all([
            fetchDetails(favIds),
            fetchDetails(histIds)
        ]);

        setFavoritesList(favs);
        setHistoryList(hist);
      } catch (error) {
        console.error("Erro ao carregar listas do usuário", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return null;

  if (favoritesList.length === 0 && historyList.length === 0) return null;

  return (
    <div className={styles.wrapper}>
        
        {favoritesList.length > 0 && (
            <section className={styles.listSection}>
                <h2 className={styles.sectionTitle}>Meus Favoritos</h2>
                <div className={styles.horizontalList}>
                    <HorizontalScroll>
                        {favoritesList.map((item) => (
                            <MovieCard 
                                key={item.id}
                                id={item.id}
                                title={item.title || item.name || "Sem Título"}
                                posterPath={item.poster_path}
                                type={item.media_type}
                                voteAverage={item.vote_average}
                                overview={item.overview}
                            />
                        ))}
                    </HorizontalScroll>
                </div>
            </section>
        )}

        {historyList.length > 0 && (
            <section className={styles.listSection}>
                <h2 className={styles.sectionTitle}>Assistidos</h2>
                <div className={styles.horizontalList}>
                    <HorizontalScroll>
                        {historyList.map((item) => (
                            <MovieCard 
                                key={item.id}
                                id={item.id}
                                title={item.title || item.name || "Sem Título"}
                                posterPath={item.poster_path}
                                type={item.media_type}
                                voteAverage={item.vote_average}
                                overview={item.overview}
                            />
                        ))}
                    </HorizontalScroll>
                </div>
            </section>
        )}
    </div>
  );
}