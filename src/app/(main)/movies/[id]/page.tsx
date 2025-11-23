import { tmdbService } from "@/services/tmdb";
import styles from "./MovieDetail.module.css";
import Image from "next/image";
import { MdFavoriteBorder, MdPlayCircleOutline, MdAccessTime, MdCalendarToday } from "react-icons/md";

interface MovieDetailProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: MovieDetailProps) {
  const { id } = await params;
  
  const movie = await tmdbService.getDetails(Number(id), 'movie');

  if (!movie) return <div className={styles.error}>Filme não encontrado</div>;

  const year = movie.release_date?.split("-")[0] || "N/A";
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;
  const duration = `${hours}h ${minutes}m`;
  
  const genres = movie.genres?.map((g: { name: string }) => g.name).join(", ");

  return (
    <div className={styles.container}>
      
      <div className={styles.backdrop}>
        <Image 
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} 
            alt="Background" 
            fill 
            className={styles.backdropImage}
        />
        <div className={styles.backdropOverlay} />
      </div>

      <div className={styles.content}>
        
        <div className={styles.posterWrapper}>
            <Image 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
                width={300} 
                height={450} 
                className={styles.poster}
            />
        </div>

        <div className={styles.info}>
            <h1 className={styles.title}>{movie.title}</h1>
            
            <div className={styles.meta}>
                <span className={styles.year}><MdCalendarToday /> {year}</span>
                <span className={styles.runtime}><MdAccessTime /> {duration}</span>
                <span className={styles.rating}>★ {movie.vote_average?.toFixed(1)}</span>
            </div>

            <p className={styles.genres}>{genres}</p>

            <p className={styles.tagline}>{movie.tagline}</p>

            <div className={styles.actions}>
                <button className={styles.btnWatch}>
                    <MdPlayCircleOutline size={24} /> Assistir Agora
                </button>

                <button className={styles.btnFavorite}>
                    <MdFavoriteBorder size={24} /> Adicionar aos Favoritos
                </button>
            </div>

            <div className={styles.overviewSection}>
                <h3>Sinopse</h3>
                <p>{movie.overview}</p>
            </div>
        </div>

      </div>

      <div className={styles.commentsSection}>
        <h2>Comentários</h2>
        <p>Em breve...</p>
      </div>

    </div>
  );
}