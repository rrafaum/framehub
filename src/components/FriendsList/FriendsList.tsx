"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { backendService } from "@/services/backend";
import styles from "./FriendList.module.css";

interface User {
  id: string;
  name: string;
}

interface FriendsListProps {
  userId?: string;
  isOwnProfile?: boolean;
}

export default function FriendsList({ userId, isOwnProfile = false }: FriendsListProps) {
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        let friendIds: string[] = [];

        if (isOwnProfile) {
            friendIds = await backendService.getMyFriends();
        } else if (userId) {
            friendIds = await backendService.getUserFriends(userId);
        }

        if (!Array.isArray(friendIds) || friendIds.length === 0) {
            setFriends([]);
            return;
        }

        const allUsers = await backendService.getAllUsers();
        const friendsData = allUsers.filter((u: User) => friendIds.includes(u.id));
        
        setFriends(friendsData);
      } catch (error) {
        console.error("Erro ao carregar amigos", error);
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
  }, [userId, isOwnProfile]);

  if (loading) return <div className={styles.container}><p style={{color: '#666'}}>Carregando amigos...</p></div>;
  
  if (friends.length === 0) {
      return (
        <div className={styles.container}>
             <h3 className={styles.title}>Amigos <span className={styles.count}>(0)</span></h3>
             <p style={{color: '#666', fontStyle: 'italic'}}>Nenhum amigo encontrado.</p>
        </div>
      );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Amigos <span className={styles.count}>({friends.length})</span></h3>
      
      <div className={styles.list}>
        {friends.map((friend) => (
          <Link key={friend.id} href={`/users/${friend.id}`} className={styles.friendCard}>
            <div className={styles.avatar}>
              {friend.name.charAt(0).toUpperCase()}
            </div>
            <span className={styles.name}>{friend.name.split(" ")[0]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}