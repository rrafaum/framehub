"use client"

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./Auth.module.css";
import Image from "next/image";

export default function Auth() {

  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isExiting, setIsExiting] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    

    if (!isLogin && password !== confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }
    

    try {
      const endpoint = isLogin ? "/login" : "/register";
      const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
      const url = `${baseURL}/api/auth/v2${endpoint}`

      const payload = isLogin ? { email, password } : { name, email, password };

      const response = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ocorreu um erro inesperado.");
      }

      if (isLogin) {
        const token = data.data.accessToken || data.data.token;
        Cookies.set("framehub_token", token, { expires: 7 });

        setIsExiting(true);
        setTimeout(() => {
          router.push("/");
        }, 800);

      } else {
        alert("Conta criada com sucesso! Faça login agora.");
        setIsLogin(true);
      }

    } catch (err: unknown){
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
      setIsLoading(false);
    } finally {
      if(!isLogin) {
        setIsLoading(false);
      }
    }
  }

  return(
    <main className={styles.mainContainer}>

      <Image src="/background.jpg" alt="Background" fill priority 
      style={{ objectFit: "cover", objectPosition: "center", zIndex: -2 }} />
      <div className={styles.overlay} />

      <header className={styles.header}>
        <Link href="/">
          <Image src="/framehub-logo.png" width={250}
          height={80} alt="Framehub Logo" />
        </Link>
      </header>

      <div className={styles.loginBox}>

        
          <h2 key={isLogin ? "title-login" : "title-register"} 
          className={styles.formFade}>{isLogin ? "Entrar" : "Criar conta"}</h2>

          {error && <div style={{ color: '#ff6b6b', marginBottom: '15px', 
            background: 'rgba(0,0,0,0.5)', padding: '10px', 
            borderRadius: '4px' }}>{error}</div>
          }
          
          <form onSubmit={handleSubmit}>

            <div key={isLogin ? "login" : "register"} className={styles.formFade}>

              {!isLogin && (<input required type="text" placeholder="Nome completo"
              className={styles.inputBox} value={name} onChange={(e) => setName(e.target.value)} />)}

              <input required type="email" placeholder="Email"
              className={styles.inputBox} value={email} onChange={(e) => setEmail(e.target.value)} />

              <input required type="password" placeholder="Senha"
              className={styles.inputBox} value={password} onChange={(e) => setPassword(e.target.value)} />

              {!isLogin && (<input required type="password"
              placeholder="Confirmar senha" className={styles.inputBox} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />)}

              <button type="submit" className={styles.submitLogin} disabled={isLoading}>
                {isLoading ? "Carregando..." : (isLogin ? "Entrar" : "Cadastrar")}
              </button>

            </div>

            <p>OU</p>
            
            <button type="button" className={styles.switchRegister} 
              onClick={toggleAuthMode}>{isLogin ? "Registre-se" : "Fazer Login"}
            </button>

          </form>
      </div>

      <div className={`${styles.transitionOverlay} ${isExiting ? styles.active : ''}`} />
    </main>
  );
}