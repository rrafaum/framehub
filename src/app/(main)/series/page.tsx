import { tmdbService } from "@/services/tmdb";
import { MovieCard } from "@/components/MovieCard/MovieCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import styles from "./Series.module.css";

export default async function SeriesPage() {
  const data = await tmdbService.getPopular('tv');
  const series = data?.results || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>

        <div style={{ marginBottom: '30px', maxWidth: '600px', margin: '-80px auto 30px auto' }}>
          <SearchBar />
        </div>


        <h1>Séries</h1>
        <p>As séries de TV que todo mundo está assistindo.</p>
      </div>

      <div className={styles.grid}>
        {series.map((serie: { 
            id: number; 
            name: string; 
            poster_path: string; 
            vote_average: number; 
            overview: string 
        }) => (
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