import { tmdbService } from "@/services/tmdb";
import { MovieCard } from "@/components/MovieCard/MovieCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import styles from "./Search.module.css";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  
  let results = [];

  if (query) {
    const data = await tmdbService.searchMulti(query);
    
    results = data?.results?.filter((item: { media_type: string }) => 
        item.media_type === 'movie' || item.media_type === 'tv'
    ) || [];
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>

        <div style={{ marginBottom: '30px', maxWidth: '600px', margin: '-80px auto 30px auto' }}>
            <SearchBar />
        </div>

        {query ? (
            <h1>Resultados para: <span className={styles.term}>&quot;{query}&quot;</span></h1>
        ) : (
            <h1>Digite algo para pesquisar</h1>
        )}
      </div>

      {query && results.length === 0 && (
        <div className={styles.noResults}>
            <p>Nenhum filme ou série encontrado para esse termo.</p>
        </div>
      )}

      <div className={styles.grid}>
        {results.map((item: { 
            id: number; 
            title?: string; 
            name?: string; 
            poster_path: string; 
            media_type: 'movie' | 'tv';
            vote_average: number;
            overview: string;
        }) => (
          <MovieCard 
            key={item.id}
            id={item.id}
            title={item.title || item.name || "Sem Título"}
            posterPath={item.poster_path}
            type={item.media_type} 
            voteAverage={item.vote_average}
            overview={item.overview}
          />
        ))}
      </div>
    </div>
  );
}