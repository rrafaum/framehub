"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MdSearch } from "react-icons/md";
import styles from "./SearchBar.module.css";

function SearchBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const urlQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]); 

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