"use client";

import Image from "next/image";
import styles from "./MovieCard.module.css"; 
import Link from "next/link";
import { MdStar } from "react-icons/md";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  type: 'movie' | 'tv';
  voteAverage?: number;
  overview?: string;
}

export const MovieCard = ({ id, title, posterPath, type, voteAverage, overview }: MovieCardProps) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  const imageUrl = posterPath 
    ? `${imageBaseUrl}${posterPath}` 
    : "/placeholder-movie.png"; 

  const linkHref = `/${type === 'movie' ? 'movies' : 'series'}/${id}`;
  
  const formattedRating = voteAverage ? voteAverage.toFixed(1) : "";

  return (
    <Link href={linkHref} className={styles.cardContainer} draggable={false}>
      <div className={styles.imageWrapper}>
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.posterImage} 
          draggable={false}
        />

        <div className={styles.hoverOverlay}>
            <div className={styles.hoverContent}>
                <h3 className={styles.cardTitle}>{title}</h3>
                
                <div className={styles.metaInfo}>
                    {voteAverage && (
                        <span className={styles.rating}>
                            <MdStar color="#46d369" /> {formattedRating}
                        </span>
                    )}
                </div>

                {overview && <p className={styles.overview}>{overview}</p>}
            </div>
        </div>

      </div>
    </Link>
  );
};