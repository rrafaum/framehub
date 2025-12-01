"use client";

import { useState, useEffect } from "react";
import { MdEdit, MdCheck, MdClose, MdPersonAdd } from "react-icons/md"; 
import styles from "./ProfileHeader.module.css";
import toast from "react-hot-toast";
import Image from "next/image";
import { backendService } from "@/services/backend";

interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
}

interface ProfileHeaderProps {
  user: User;
  bannerUrl?: string | null;
  isOwnProfile?: boolean; 
}

export default function ProfileHeader({ user, bannerUrl, isOwnProfile = false }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const displayName = user.name || "Usuário";
  
  const [bio, setBio] = useState(user.bio || "Olá, sou novo no FrameHub");


  useEffect(() => {
    setBio(user.bio || "Olá, sou novo no FrameHub");
  }, [user.bio]);

  useEffect(() => {
    if (!isOwnProfile && user.id) {
        const checkFollow = async () => {
            try {
                const friends = await backendService.getMyFriends();
                if (Array.isArray(friends) && friends.includes(user.id)) {
                    setIsFollowing(true);
                }
            } catch (error) {
                console.error(error);
            }
        };
        checkFollow();
    }
  }, [user.id, isOwnProfile]);

  const handleSave = async () => {
    if (!user.id) return;

    try {
      setLoading(true);
      await backendService.updateUser(user.id, { 
          name: user.name, 
          bio: bio         
      });
      toast.success("Perfil atualizado!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar bio.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
      setBio(user.bio || "Olá, sou novo no FrameHub");
      setIsEditing(false);
  };

  const handleFollowToggle = async () => {
    try {
        if (isFollowing) {
            await backendService.unfollowUser(user.id);
            setIsFollowing(false);
        } else {
            await backendService.followUser(user.id);
            setIsFollowing(true);
        }
    } catch (error) {
        console.error("Erro ao alterar amizade:", error);
        toast.error("Erro ao alterar amizade.");
    }
  };

  return (
    <div className={styles.profileWrapper}>
        <div className={styles.banner}>
            {bannerUrl ? (
                <Image src={bannerUrl} alt="Capa" fill className={styles.bannerImage} priority />
            ) : (
                <div className={styles.bannerFallback} />
            )}
            <div className={styles.bannerOverlay} />
        </div>

        <div className={styles.headerContent}>
            <div className={styles.avatarSection}>
                <div className={styles.avatar}>{displayName.charAt(0).toUpperCase()}</div>
            </div>

            <div className={styles.infoSection}>
                <h1 className={styles.username}>{displayName}</h1>
                
                <div className={styles.bioWrapper}>
                    {isOwnProfile ? (
                        isEditing ? (
                            <div className={styles.editBox}>
                                <textarea 
                                    value={bio} 
                                    onChange={(e) => setBio(e.target.value)}
                                    className={styles.bioInput}
                                    maxLength={150}
                                    rows={3}
                                    disabled={loading}
                                />
                                <div className={styles.editButtons}>
                                    <button onClick={handleSave} className={styles.btnSave} disabled={loading}>
                                        <MdCheck /> {loading ? "..." : "Salvar"}
                                    </button>
                                    
                                    <button onClick={handleCancel} className={styles.btnCancel} disabled={loading}>
                                        <MdClose /> Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.viewBox}>
                                <p className={styles.bio}>{bio}</p>
                                <button onClick={() => setIsEditing(true)} className={styles.btnEdit}>
                                    <MdEdit size={14} /> Editar Bio
                                </button>
                            </div>
                        )
                    ) : (
                        <div className={styles.viewBox}>
                            <p className={styles.bio}>{bio}</p>
                            <button 
                                onClick={handleFollowToggle} 
                                className={styles.btnEdit} 
                                style={{ 
                                    borderColor: isFollowing ? '#46d369' : '#66c0f4', 
                                    color: isFollowing ? '#46d369' : '#66c0f4',
                                    marginTop: '10px'
                                }}
                            >
                                {isFollowing ? <><MdCheck size={16}/> Seguindo</> : <><MdPersonAdd size={16}/> Seguir</>}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}