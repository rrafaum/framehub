"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation"; // Adicionado usePathname
import { MdSearch } from "react-icons/md";
import styles from "./SearchBar.module.css";
import { useDebounce } from "@/hooks/useDebounce";

function SearchBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); 

  useEffect(() => {
    if (pathname === '/search') {
        const currentUrlQuery = searchParams.get("q") || "";
        
        if (debouncedQuery !== currentUrlQuery) {
            if (debouncedQuery.trim()) {
                router.replace(`/search?q=${encodeURIComponent(debouncedQuery)}`);
            } else {
                router.replace('/search');
            }
        }
    }
  }, [debouncedQuery, pathname, router, searchParams]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={styles.searchContainer}>
      <MdSearch className={styles.icon} size={24} />
      <input 
        type="text" 
        placeholder="Pesquisar filmes ou séries..." 
        className={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className={styles.button}>Buscar</button>
    </form>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={<div></div>}>
      <SearchBarContent />
    </Suspense>
  );
}