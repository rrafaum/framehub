"use client";

import { useState, useEffect, FormEvent, useCallback } from "react";
import { MdDeleteOutline, MdSend, MdEdit, MdClose, MdCheck } from "react-icons/md";
import { backendService } from "@/services/backend";
import toast from "react-hot-toast";
import styles from "./CommentSection.module.css";

interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
}

interface CommentSectionProps {
  movieId: number;
}

export default function CommentSection({ movieId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const [usersMap, setUsersMap] = useState<{ [key: string]: string }>({});

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const crossoverId = String(movieId);

  useEffect(() => {
    const initData = async () => {
      try {
        const me = await backendService.getMe();
        if (me?.data?.userId) setCurrentUserId(me.data.userId);

        const allUsers = await backendService.getAllUsers();
        if (Array.isArray(allUsers)) {
          const map: { [key: string]: string } = {};
          allUsers.forEach((u: User) => {
            map[u.id] = u.name;
          });
          setUsersMap(map);
        }
      } catch (error) {
        console.error(error);
      }
    };
    initData();
  }, []);

  const loadComments = useCallback(async () => {
    try {
      const data = await backendService.getComments(crossoverId);
      let commentsList: Comment[] = [];

      if (Array.isArray(data)) {
        commentsList = data;
      } else if (data && Array.isArray(data.comments)) {
        commentsList = data.comments;
      } else if (data && Array.isArray(data.data)) {
        commentsList = data.data;
      }
      setComments(commentsList);
    } catch (error) {
      console.error("Erro ao carregar comentários", error);
    }
  }, [crossoverId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      await backendService.addComment(crossoverId, newComment);
      toast.success("Comentário enviado!");
      setNewComment("");
      loadComments();
    } catch (error) {
        console.error(error);
        toast.error("Erro ao enviar.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Tem certeza?")) return;
    try {
      await backendService.deleteComment(commentId);
      toast.success("Removido.");
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (error) {
        console.error(error);
        toast.error("Erro ao deletar.");
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  const saveEdit = async (commentId: string) => {
    if (!editedContent.trim()) return;
    try {
      await backendService.updateComment(commentId, editedContent);
      
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, content: editedContent } : c
      ));
      
      toast.success("Atualizado!");
      setEditingCommentId(null);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao editar.");
    }
  };

  const getAuthorName = (userId: string) => {
    return usersMap[userId] || "Usuário";
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Comentários ({comments.length})</h3>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="text" 
          placeholder="Escreva um comentário..." 
          className={styles.input}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className={styles.btnSend} disabled={loading || !newComment.trim()}>
          <MdSend />
        </button>
      </form>

      <div className={styles.list}>
        {comments.length === 0 && <p className={styles.empty}>Seja o primeiro a comentar!</p>}

        {comments.map((comment) => (
          <div key={comment.id} className={styles.commentCard}>
            
            <div className={styles.avatarPlaceholder}>
                {getAuthorName(comment.userId).charAt(0).toUpperCase()}
            </div>
            
            <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                    <span className={styles.userName}>{getAuthorName(comment.userId)}</span>
                    
                    <div className={styles.headerRight}>
                      
                        {currentUserId === comment.userId && !editingCommentId && (
                            <div className={styles.ownerActions}>
                                <button onClick={() => startEditing(comment)} className={styles.btnAction} title="Editar">
                                    <MdEdit size={16} />
                                </button>
                                <button onClick={() => handleDelete(comment.id)} className={styles.btnAction} title="Apagar">
                                    <MdDeleteOutline size={16} />
                                </button>
                            </div>
                        )}

                        <span className={styles.date}>
                          {(() => {
                            const d = new Date(comment.createdAt);
                            const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
                            const timeStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                            
                            return `${dateStr} às ${timeStr}`;
                          })()}
                        </span>
                    </div>
                </div>

                {editingCommentId === comment.id ? (
                    <div className={styles.editWrapper}>
                        <input 
                            type="text" 
                            className={styles.editInput}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            autoFocus
                        />
                        <div className={styles.editActions}>
                            <button onClick={() => saveEdit(comment.id)} className={styles.btnSave}>
                                <MdCheck size={20} />
                            </button>
                            <button onClick={cancelEditing} className={styles.btnCancel}>
                                <MdClose size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className={styles.text}>{comment.content}</p>
                )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}