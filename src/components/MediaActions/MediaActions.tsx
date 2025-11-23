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
  const [isWatched, setIsWatched] = useState(false);
  const [loading, setLoading] = useState(true);

  const crossoverId = String(id);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const [favorites, history] = await Promise.all([
          backendService.getMyFavorites(),
          backendService.getMyHistory()
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
        setIsWatched(checkId(history));

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

  const handleWatch = async () => {
    if (isWatched) {
        toast("Você já assistiu a este título!", { icon: '👀' });
        return;
    }

    try {
      setIsWatched(true);
      await backendService.addToHistory(crossoverId);
      toast.success("Marcado como assistido!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar histórico.");
      setIsWatched(false);
    }
  };

  if (loading) {
      return (
        <div className={styles.actions} style={{ opacity: 0.5, pointerEvents: 'none' }}>
            <button className={styles.btnWatch}><MdPlayCircleOutline size={24} /> Carregando...</button>
            <button className={styles.btnFavorite}><MdFavoriteBorder size={24} /> ...</button>
        </div>
      );
  }

  return (
    <div className={styles.actions}>
      
      <button 
        className={`${styles.btnWatch} ${isWatched ? styles.watched : ''}`} 
        onClick={handleWatch}
      >
        {isWatched ? (
            <> <MdCheckCircle size={24} /> Assistido </>
        ) : (
            <> <MdPlayCircleOutline size={24} /> Assisti </>
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