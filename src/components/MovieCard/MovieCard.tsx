"use client";

import Image from "next/image";
import styles from "./MovieCard.module.css"; 
import Link from "next/link";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  type: 'movie' | 'tv'; 
}

export const MovieCard = ({ id, title, posterPath, type }: MovieCardProps) => {
  const imageBaseUrl = "https://image.tmdb.org/t/p/w500";

  const imageUrl = posterPath 
    ? `${imageBaseUrl}${posterPath}` 
    : "/placeholder-movie.png"; 

  const linkHref = `/${type === 'movie' ? 'movies' : 'series'}/${id}`;

  return (
    <Link href={linkHref} className={styles.cardContainer} draggable={false}>
      <div className={styles.imageWrapper}>
        <Image 
          src={imageUrl} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.posterImage} draggable={false}
        />
      </div>
    </Link>
  );
};