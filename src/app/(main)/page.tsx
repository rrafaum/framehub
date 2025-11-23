import { tmdbService } from "@/services/tmdb";
import { MovieCard } from "@/components/MovieCard/MovieCard"; 
import SearchBar from "@/components/SearchBar/SearchBar";
import styles from "./Page.module.css";
import HorizontalScroll from "@/components/HorizontalScroll/HorizontalScroll";

export default async function Home() {
  
  const [trendingMoviesData, trendingSeriesData] = await Promise.all([
    tmdbService.getTrending('movie'),
    tmdbService.getTrending('tv')
  ]);

  const movies = trendingMoviesData?.results || [];
  const series = trendingSeriesData?.results || [];

  const featuredMovie = movies[0];

  return (
    <div className={styles.homeContainer}>
      
      {featuredMovie && (
        <div
          className={styles.heroBanner}
          style={{
            backgroundImage: `linear-gradient(to top, #141414, transparent 90%), url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`
          }}
        >
          <div className={styles.heroContent}>
            <h1>{featuredMovie.title}</h1>
            <p>{featuredMovie.overview}</p>
            <div style={{ marginTop: '30px' }}>
                <SearchBar />
            </div>
          </div>
        </div>
      )}

      <div className={styles.contentWrapper}>
       
        <section className={styles.listSection}>
          <h2 className={styles.sectionTitle}>Filmes em Alta</h2>
          <div className={styles.horizontalList}>
            <HorizontalScroll>
              {movies.map((movie: { id: number; title?: string; name?: string; poster_path: string }) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title || "Sem Título"}
                  posterPath={movie.poster_path}
                  type="movie"
                />
              ))}
            </HorizontalScroll>
          </div>
        </section>

        <section className={styles.listSection}>
          <h2 className={styles.sectionTitle}>Séries Populares</h2>
          <div className={styles.horizontalList}>
            <HorizontalScroll>
              {series.map((serie: { id: number; title?: string; name?: string; poster_path: string }) => (
                <MovieCard
                  key={serie.id}
                  id={serie.id}
                  title={serie.name || "Sem Nome"}
                  posterPath={serie.poster_path}
                  type="tv"
                />
              ))}
            </HorizontalScroll>
          </div>
        </section>

      </div>
    </div>
  );
}