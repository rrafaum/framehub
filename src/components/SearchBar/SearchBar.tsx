"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MdSearch } from "react-icons/md";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

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
        placeholder="O que você quer assistir?" 
        className={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className={styles.button}>Buscar</button>
    </form>
  );
}