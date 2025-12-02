"use client";

import { useState, useEffect } from "react";
import { backendService } from "@/services/backend";
import { tmdbService } from "@/services/tmdb";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import { useRouter, useParams } from "next/navigation";
import SearchBar from "@/components/SearchBar/SearchBar";
import FriendsList from "@/components/FriendsList/FriendsList";
import { MovieCard } from "@/components/MovieCard/MovieCard";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";
import styles from "../../profile/Profile.module.css"; 

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

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [favoritesList, setFavoritesList] = useState<MediaItem[]>([]);
  const [watchlistList, setWatchlistList] = useState<MediaItem[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const targetUserId = String(params.id);
        
        const meRes = await backendService.getMe();
        if (meRes?.data?.userId === targetUserId) {
            router.push("/profile"); 
            return;
        }

        const foundUser = await backendService.getUserById(targetUserId);
        if (!foundUser) {
            setLoading(false);
            return;
        }
        setTargetUser(foundUser);

        const [rawFavs, rawWatch] = await Promise.all([
            backendService.getPublicFavorites(targetUserId),
            backendService.getPublicWatchlist(targetUserId)
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
        const watchIds = normalizeIds(rawWatch).reverse();

        const fetchDetails = async (ids: string[]) => {
            const uniqueIds = Array.from(new Set(ids));
            const promises = uniqueIds.map(id => tmdbService.getMediaById(id));
            const results = await Promise.all(promises);
            return results.filter(Boolean) as MediaItem[];
        };

        const [favs, watch] = await Promise.all([
            fetchDetails(favIds),
            fetchDetails(watchIds)
        ]);

        setFavoritesList(favs);
        setWatchlistList(watch);

      } catch (error) {
        console.error("Erro ao carregar perfil público", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params, router]);

  if (loading) {
     return (
        <div className={styles.container}>
            <div style={{ height: '350px', background: '#1b1b1b', borderRadius: '0 0 12px 12px', marginBottom: '50px', animation: 'pulse 1.5s infinite' }} />
            <div className={styles.contentBody}>
                <div className={styles.grid}>
                    {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        </div>
    );
  }
  
  if (!targetUser) return <div className={styles.container} style={{paddingTop: '150px', textAlign: 'center'}}><p>Usuário não encontrado.</p></div>;

  const lastInteraction = favoritesList[0] || watchlistList[0];
  const bannerImage = lastInteraction?.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${lastInteraction.backdrop_path}` 
    : null;

  return (
    <div className={styles.container}>
      
      <div className={styles.searchWrapper}>
        <SearchBar />
      </div>
      
      <ProfileHeader 
        user={targetUser} 
        bannerUrl={bannerImage} 
        isOwnProfile={false} 
      />

      <div className={styles.contentBody}>
        
        <FriendsList userId={targetUser.id} isOwnProfile={false} />

        <hr className={styles.divider} />

        <section className={styles.section}>
            <h2 className={styles.title}>Favoritos <span className={styles.count}>({favoritesList.length})</span></h2>
            
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
                <p className={styles.empty}>Nenhum favorito visível.</p>
            )}
        </section>

        <hr className={styles.divider} />

        <section className={styles.section}>
            <h2 className={styles.title}>Lista de Assistir <span className={styles.count}>({watchlistList.length})</span></h2>
            
            {watchlistList.length > 0 ? (
                <div className={styles.grid}>
                    {watchlistList.map((item) => (
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
                <p className={styles.empty}>Lista vazia.</p>
            )}
        </section>

      </div>
    </div>
  );
}