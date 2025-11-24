"use client";

import { useState, useEffect } from "react";
import { MdFavoriteBorder, MdFavorite, MdPlayCircleOutline, MdCheckCircle } from "react-icons/md";
import styles from "./MediaActions.module.css";
import { backendService } from "@/services/backend";
import toast from "react-hot-toast";

interface MediaActionsProps {
  id: number;
  type: 'movie' | 'tv';
}

type BackendItem = string | number | {
  crossoverId?: string | number;
  id?: string | number;
  movieId?: string | number;
};

export default function MediaActions({ id }: MediaActionsProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  const crossoverId = String(id);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [favorites, watchlist] = await Promise.all([
          backendService.getMyFavorites(),
          backendService.getMyWatchlist(),
        ]);

        const checkId = (list: BackendItem[]) => {
            return list.some((item: BackendItem) => {
                if (typeof item === 'string' || typeof item === 'number') {
                    return String(item) === crossoverId;
                }
                if (typeof item === 'object' && item !== null) {
                    return String(item.crossoverId || item.id || item.movieId) === crossoverId;
                }
                return false;
            });
        };

        setIsFavorited(checkId(favorites));
        setIsInWatchlist(checkId(watchlist));

      } catch (error) {
        console.error("Erro ao verificar status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [crossoverId]);

  const handleFavorite = async () => {
    try {
      const previousState = isFavorited;
      setIsFavorited(!isFavorited); 

      if (previousState) {
        await backendService.removeFavorite(crossoverId);
        toast.success("Removido dos Favoritos.");
      } else {
        await backendService.addFavorite(crossoverId);
        toast.success("Adicionado aos Favoritos!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar favoritos.");
      setIsFavorited(!isFavorited);
    }
  };

  const handleWatchlist = async () => {
    try {
      const previousState = isInWatchlist;
      setIsInWatchlist(!isInWatchlist);

      if (previousState) {
        await backendService.removeFromWatchlist(crossoverId);
        toast.success("Removido da sua lista.");
      } else {
        await backendService.addToWatchlist(crossoverId);
        toast.success("Adicionado à sua lista!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar lista.");
      setIsInWatchlist(!isInWatchlist);
    }
  };

  if (loading) {
      return (
        <div className={styles.actions} style={{ opacity: 0.5, pointerEvents: 'none' }}>
            <button className={styles.btnWatch}><MdPlayCircleOutline size={24} /> ...</button>
            <button className={styles.btnFavorite}><MdFavoriteBorder size={24} /> ...</button>
        </div>
      );
  }

  return (
    <div className={styles.actions}>
      
      <button 
        className={`${styles.btnWatch} ${isInWatchlist ? styles.watched : ''}`} 
        onClick={handleWatchlist}
      >
        {isInWatchlist ? (
            <> <MdCheckCircle size={24} /> Assistido </> 
        ) : (
            <> <MdPlayCircleOutline size={24} /> Minha Lista </>
        )}
      </button>

      <button 
        className={`${styles.btnFavorite} ${isFavorited ? styles.active : ''}`} 
        onClick={handleFavorite}
      >
        {isFavorited ? (
            <> <MdFavorite size={24} color="#e50914" /> Favorito </>
        ) : (
            <> <MdFavoriteBorder size={24} /> Adicionar aos Favoritos </>
        )}
      </button>
    </div>
  );
}