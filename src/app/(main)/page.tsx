import { tmdbService } from "@/services/tmdb";
import { MovieCard } from "@/components/MovieCard/MovieCard"; 
import SearchBar from "@/components/SearchBar/SearchBar";
import styles from "./Page.module.css";
import HorizontalScroll from "@/components/HorizontalScroll/HorizontalScroll";
import { MdPlayArrow, MdInfoOutline } from "react-icons/md";

export default async function Home() {
  
  const [trendingMoviesData, trendingSeriesData] = await Promise.all([
    tmdbService.getTrending('movie'),
    tmdbService.getTrending('tv')
  ]);

  const movies = trendingMoviesData?.results || [];
  const series = trendingSeriesData?.results || [];

  const featuredMovie = movies[0];

  let featuredDetails = null;
  
  if (featuredMovie) {
    featuredDetails = await tmdbService.getDetails(featuredMovie.id, 'movie');
  }

  const genres = featuredDetails?.genres?.map((g: { name: string }) => g.name).join(" • ");

  return (
    <div className={styles.homeContainer}>
      
      {featuredMovie && (
        <div
          className={styles.heroBanner}
          style={{
            backgroundImage: `linear-gradient(to top, #141414 10%, transparent 90%), url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`
          }}
        >
          <div className={styles.heroContent}>
            <h1>{featuredMovie.title}</h1>

            {featuredDetails && (
                <div className={styles.heroMeta}>
                    <span className={styles.match}>{featuredDetails.vote_average?.toFixed(1)} pontos</span>
                    <span className={styles.genres}>{genres}</span>
                </div>
            )}

            <p className={styles.overview}>{featuredDetails ? featuredDetails.overview : featuredMovie.overview}</p>

            <div className={styles.heroButtons}>
                <button className={styles.btnPlay}>
                    <MdPlayArrow size={28} /> Assistir
                </button>
                <button className={styles.btnInfo}>
                    <MdInfoOutline size={28} /> Mais Informações
                </button>
            </div>

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
              {movies.map((movie: { id: number; title: string; poster_path: string; vote_average: number; overview: string }) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title || "Sem Título"}
                  posterPath={movie.poster_path}
                  type="movie"
                  voteAverage={movie.vote_average}
                  overview={movie.overview}
                />
              ))}
            </HorizontalScroll>
          </div>
        </section>

        <section className={styles.listSection}>
          <h2 className={styles.sectionTitle}>Séries Populares</h2>
          <div className={styles.horizontalList}>
            <HorizontalScroll>
              {series.map((serie: { id: number; name: string; poster_path: string; vote_average: number; overview: string }) => (
                <MovieCard
                  key={serie.id}
                  id={serie.id}
                  title={serie.name || "Sem Nome"}
                  posterPath={serie.poster_path}
                  type="tv"
                  voteAverage={serie.vote_average}
                  overview={serie.overview}
                />
              ))}
            </HorizontalScroll>
          </div>
        </section>

      </div>
    </div>
  );
}