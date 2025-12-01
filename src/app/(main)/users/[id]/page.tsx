"use client";

import { useState, useEffect } from "react";
import { backendService } from "@/services/backend";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import styles from "../../profile/Profile.module.css"; 
import { useRouter, useParams } from "next/navigation";
import SearchBar from "@/components/SearchBar/SearchBar";
import FriendsList from "@/components/FriendsList/FriendsList";
import { MdLockOutline } from "react-icons/md";

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
}

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const targetUserId = String(params.id);
        
        const meRes = await backendService.getMe();
        if (meRes?.data?.userId === targetUserId) {
            router.push("/profile"); 
            return;
        }

        const foundUser = await backendService.getUserById(targetUserId);
        if (!foundUser) {
            setLoading(false);
            return; 
        }
        setTargetUser(foundUser);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [params, router]);

  if (loading) return <div className={styles.container} style={{paddingTop: '100px'}}><p style={{textAlign:'center'}}>Carregando perfil...</p></div>;
  
  if (!targetUser) return <div className={styles.container} style={{paddingTop: '100px'}}><p style={{textAlign:'center'}}>Usuário não encontrado.</p></div>;

  return (
    <div className={styles.container}>
      
      <div className={styles.searchWrapper}>
        <SearchBar />
      </div>
      
      <ProfileHeader 
        user={targetUser} 
        bannerUrl={null} 
        isOwnProfile={false} 
      />

      <div className={styles.contentBody}>
        
        <FriendsList userId={targetUser.id} isOwnProfile={false} />

        <hr className={styles.divider} />

        <section className={styles.section}>
            <h2 className={styles.title} style={{opacity: 0.5}}>
                Favoritos & Histórico
            </h2>
            
            <div className={styles.empty} style={{ flexDirection: 'row', gap: '20px' }}>
                <MdLockOutline size={40} />
                <p>As listas de filmes deste usuário são privadas.</p>
            </div>
        </section>

      </div>
    </div>
  );
}