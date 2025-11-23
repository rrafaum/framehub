"use client";

import { useState } from "react";
import { MdEdit, MdCheck, MdClose } from "react-icons/md";
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

export default function ProfileHeader({ user, bannerUrl }: { user: User; bannerUrl?: string | null }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const displayName = user.name || "Usuário";
  const [bio, setBio] = useState(user.bio || "Olá, sou novo no FrameHub");

  const handleSave = async () => {
    if (!user.id) return;

    try {
      setLoading(true);
      
      await backendService.updateUser(user.id, { 
          name: user.name, // Mantém o nome atual
          bio: bio         // Atualiza a bio
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
                    {isEditing ? (
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
                                <button onClick={() => setIsEditing(false)} className={styles.btnCancel} disabled={loading}>
                                    <MdClose /> Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.viewBox}>
                            <p className={styles.bio}>&quot;{bio}&quot;</p>
                            <button onClick={() => setIsEditing(true)} className={styles.btnEdit}>
                                <MdEdit size={14} /> Editar Bio
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}