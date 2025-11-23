import { tmdbService } from "@/services/tmdb";
import styles from "../../movies/[id]/MovieDetail.module.css"; 
import Image from "next/image";
import { MdFavoriteBorder, MdPlayCircleOutline, MdAccessTime, MdCalendarToday } from "react-icons/md";

interface SeriesDetailProps {
  params: Promise<{ id: string }>;
}

export default async function SeriesDetailPage({ params }: SeriesDetailProps) {
  const { id } = await params;
  
  const serie = await tmdbService.getDetails(Number(id), 'tv');

  if (!serie) return <div className={styles.error}>Série não encontrada</div>;

  const year = serie.first_air_date?.split("-")[0] || "N/A";
  const seasons = serie.number_of_seasons;
  const episodes = serie.number_of_episodes;
  const durationInfo = `${seasons} Temp. • ${episodes} Ep.`;

  const genres = serie.genres?.map((g: { name: string }) => g.name).join(", ");

  return (
    <div className={styles.container}>
      
      <div className={styles.backdrop}>
        <Image 
            src={`https://image.tmdb.org/t/p/original${serie.backdrop_path}`} 
            alt="Background" 
            fill 
            className={styles.backdropImage}
        />
        <div className={styles.backdropOverlay} />
      </div>

      <div className={styles.content}>
        
        <div className={styles.posterWrapper}>
            <Image 
                src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`} 
                alt={serie.name} 
                width={300} 
                height={450} 
                className={styles.poster}
            />
        </div>

        <div className={styles.info}>
            <h1 className={styles.title}>{serie.name}</h1>
            
            <div className={styles.meta}>
                <span className={styles.year}><MdCalendarToday /> {year}</span>
                <span className={styles.runtime}><MdAccessTime /> {durationInfo}</span>
                <span className={styles.rating}>★ {serie.vote_average?.toFixed(1)}</span>
            </div>

            <p className={styles.genres}>{genres}</p>

            <p className={styles.tagline}>{serie.tagline}</p>

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
                <p>{serie.overview}</p>
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