"use client";

import { useState, useEffect } from "react";
import { backendService } from "@/services/backend";
import { tmdbService } from "@/services/tmdb";
import { MovieCard } from "@/components/MovieCard/MovieCard";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import styles from "./Profile.module.css";
import { useRouter } from "next/navigation";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import FriendsList from "@/components/FriendsList/FriendsList";

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path?: string;
  media_type: 'movie' | 'tv';
  vote_average: number;
  overview: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
}

type RawBackendItem = string | number | {
  crossoverId?: string | number;
  id?: string | number;
  movieId?: string | number;
  [key: string]: unknown;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [favoritesList, setFavoritesList] = useState<MediaItem[]>([]);
  const [historyList, setHistoryList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const meRes = await backendService.getMe();
        if (!meRes || !meRes.data) {
          router.push("/login"); 
          return;
        }
        const myId = meRes.data.userId;

        const allUsers = await backendService.getAllUsers();
        const myFullData = allUsers.find((u: User) => u.id === myId);

        setUser(myFullData || { ...meRes.data, id: myId });

        const [rawFavs, rawWatchlist] = await Promise.all([
          backendService.getMyFavorites(),
          backendService.getMyWatchlist()
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
        const watchIds = normalizeIds(rawWatchlist).reverse();

        const fetchDetails = async (ids: string[]) => {
            const uniqueIds = Array.from(new Set(ids));
            const promises = uniqueIds.map(id => tmdbService.getMediaById(id));
            const results = await Promise.all(promises);
            return results.filter(Boolean) as MediaItem[];
        };

        const [favs, watchlist] = await Promise.all([
            fetchDetails(favIds),
            fetchDetails(watchIds)
        ]);

        setFavoritesList(favs);
        setHistoryList(watchlist);

      } catch (error) {
        console.error("Erro ao carregar perfil", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
        <div className={styles.container}>
            <div style={{ height: '350px', background: '#1b1b1b', 
              borderRadius: '0 0 12px 12px', marginBottom: '50px', 
              animation: 'pulse 1.5s infinite' }} />
            <div className={styles.contentBody}>
                <div className={styles.grid}>
                    {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        </div>
    );
  }

  if (!user) return null;

  const lastInteraction = favoritesList[0] || historyList[0];
  const bannerImage = lastInteraction?.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${lastInteraction.backdrop_path}` 
    : null;

  return (
    <div className={styles.container}>
      
      <div className={styles.searchWrapper}>
        <SearchBar />
      </div>

      <ProfileHeader user={user} bannerUrl={bannerImage} isOwnProfile={true} />

      <div className={styles.contentBody}>

          <FriendsList isOwnProfile={true} />

          <section className={styles.section}>
            <h2 className={styles.title}>Meus Favoritos 
              <span className={styles.count}>({favoritesList.length})</span>
            </h2>
            
            {favoritesList.length > 0 ? (
                <div className={styles.grid}>
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
                </div>
            ) : (
                <p className={styles.empty}>Você ainda não favoritou nada.</p>
            )}
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2 className={styles.title}>Assistidos 
              <span className={styles.count}>({historyList.length})</span>
            </h2>
            
            {historyList.length > 0 ? (
                <div className={styles.grid}>
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
                </div>
            ) : (
                <p className={styles.empty}>Sua lista está vazia.</p>
            )}
          </section>

      </div>
    </div>
  );
}