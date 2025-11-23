"use client";

import { useState } from "react";
import { MdFavoriteBorder, MdFavorite, MdPlayCircleOutline, MdCheckCircle } from "react-icons/md";
import styles from "./MediaActions.module.css";
import { backendService } from "@/services/backend";
import toast from "react-hot-toast";

interface MediaActionsProps {
  id: number;
  type: 'movie' | 'tv';
}

export default function MediaActions({ id }: MediaActionsProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [loading, setLoading] = useState(false);

  const crossoverId = String(id);

  const handleFavorite = async () => {
    try {
      setLoading(true);
      await backendService.addFavorite(crossoverId);
      
      setIsFavorited(true);
      toast.success("Adicionado aos Favoritos!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao favoritar. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleWatch = async () => {
    try {
      setLoading(true);
      await backendService.addToHistory(crossoverId);
      
      setIsWatched(true);
      toast.success("Bom filme! Adicionado ao histórico.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao registar visualização.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.actions}>
      <button 
        className={`${styles.btnWatch} ${isWatched ? styles.watched : ''}`} 
        onClick={handleWatch}
        disabled={loading}
      >
        {isWatched ? (
            <> <MdCheckCircle size={24} /> Assistido </>
        ) : (
            <> <MdPlayCircleOutline size={24} /> Assistir Agora </>
        )}
      </button>

      <button 
        className={`${styles.btnFavorite} ${isFavorited ? styles.active : ''}`} 
        onClick={handleFavorite}
        disabled={loading}
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