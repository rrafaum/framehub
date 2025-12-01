"use client";

import { useState, useEffect, useCallback } from "react";
import { backendService } from "@/services/backend";
import styles from "./Community.module.css";
import { MdSearch, MdPersonAdd, MdCheck, MdPerson } from "react-icons/md";
import toast from "react-hot-toast";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
}

export default function CommunityPage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  
  const [users, setUsers] = useState<User[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]); 
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
        try {
            const me = await backendService.getMe();
            if (me && me.data) {
                setCurrentUserId(me.data.userId);
            }

            const friendsIds = await backendService.getMyFriends();
            if (Array.isArray(friendsIds)) {
                setFollowingIds(friendsIds);
            }
        } catch (error) {
            console.error("Erro ao carregar dados iniciais", error);
        }
    };
    loadInitialData();
  }, []);

  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
        setUsers([]);
        return;
    }

    try {
        setLoading(true);
        const results = await backendService.searchUsers(searchTerm);
        
        let usersList = Array.isArray(results) ? results : [];

        if (currentUserId) {
            usersList = usersList.filter((u: User) => u.id !== currentUserId);
        }

        setUsers(usersList);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  }, [currentUserId]);

 
  useEffect(() => {
      performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleFollowToggle = async (targetId: string) => {
    const isFollowing = followingIds.includes(targetId);

    if (isFollowing) {
        setFollowingIds(prev => prev.filter(id => id !== targetId));
    } else {
        setFollowingIds(prev => [...prev, targetId]);
    }

    try {
        if (isFollowing) {
            await backendService.unfollowUser(targetId);
        } else {
            await backendService.followUser(targetId);
        }
    } catch (error) {
        console.error(error);
        toast.error("Erro na ação.");
        if (isFollowing) setFollowingIds(prev => [...prev, targetId]);
        else setFollowingIds(prev => prev.filter(id => id !== targetId));
    }
  };

  return (
    <div className={styles.container}>
        
        <div className={styles.header}>
            <h1 className={styles.title}>Encontrar Amigos</h1>
            <p className={styles.subtitle}>Busque por nome e conecte-se com outros cinéfilos.</p>
            
            <form onSubmit={handleSearch} className={styles.searchBox}>
                <MdSearch className={styles.searchIcon} size={24} />
                <input 
                    type="text" 
                    placeholder="Digite o nome de um usuário..." 
                    className={styles.input}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className={styles.btnSearch} disabled={loading}>
                    {loading ? "..." : "Buscar"}
                </button>
            </form>
        </div>

        <div className={styles.resultsGrid}>
            {users.map(user => (
                <div key={user.id} className={styles.userCard}>
                    <Link href={`/users/${user.id}`} className={styles.cardLink}>
                        <div className={styles.avatar}>
                            {user.name?.charAt(0).toUpperCase() || <MdPerson />}
                        </div>
                        
                        <div className={styles.userInfo}>
                            <h3 className={styles.userName}>{user.name}</h3>
                            <p className={styles.userBio}>{user.bio || "Sem bio."}</p>
                        </div>
                    </Link>

                    <button 
                        className={`${styles.btnFollow} ${followingIds.includes(user.id) ? styles.following : ''}`}
                        onClick={() => handleFollowToggle(user.id)}
                    >
                        {followingIds.includes(user.id) ? (
                            <> <MdCheck /> Seguindo </>
                        ) : (
                            <> <MdPersonAdd /> Seguir </>
                        )}
                    </button>
                </div>
            ))}

            {users.length === 0 && !loading && query !== "" && (
                <p className={styles.empty}>Nenhum usuário encontrado.</p>
            )}
        </div>

    </div>
  );
}