import { tmdbService } from "@/services/tmdb";
import { MovieCard } from "@/components/MovieCard/MovieCard";
import styles from "./Series.module.css";

export default async function SeriesPage() {
  const data = await tmdbService.getPopular('tv');
  const series = data?.results || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Séries</h1>
        <p>As séries de TV que todo mundo está assistindo.</p>
      </div>

      <div className={styles.grid}>
        {series.map((serie: any) => (
          <MovieCard 
            key={serie.id}
            id={serie.id}
            title={serie.name}
            posterPath={serie.poster_path}
            voteAverage={serie.vote_average}
            overview={serie.overview}
            type="tv"
          />
        ))}
      </div>
    </div>
  );
}