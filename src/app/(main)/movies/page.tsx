import { tmdbService } from "@/services/tmdb";
import { MovieCard } from "@/components/MovieCard/MovieCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import styles from "./Movies.module.css";

export default async function MoviesPage() {
  const data = await tmdbService.getPopular('movie');
  const movies = data?.results || [];

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
            <div>
                <h1>Filmes</h1>
                <p>Os títulos mais populares do momento.</p>
            </div>
            <div style={{ maxWidth: '400px' }}>
                <SearchBar />
            </div>
        </div>
      </div>

      <div className={styles.grid}>
        {movies.map((movie: { 
            id: number; 
            title: string; 
            poster_path: string; 
            vote_average: number; 
            overview: string 
        }) => (
          <MovieCard 
            key={movie.id}
            id={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            voteAverage={movie.vote_average}
            overview={movie.overview}
            type="movie"
          />
        ))}
      </div>
    </div>
  );
}