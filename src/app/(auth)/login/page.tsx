"use client"

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import styles from "./Auth.module.css";
import Image from "next/image";
import toast from "react-hot-toast";
import { MdVisibility, MdVisibilityOff, MdCheckCircle } from "react-icons/md";

export default function Auth() {

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState({
    main: false,
    confirm: false
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const [isExiting, setIsExiting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFieldErrors({});
  }, []);

  const toggleAuthMode = () => {
    if (showSuccess) return;
    setIsLogin(!isLogin);
    setFieldErrors({});

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword({ main: false, confirm: false });
  }

  const toggleEye = (field: 'main' | 'confirm') => {
    setShowPassword(prev => ({
        ...prev,
        [field]: !prev[field]
    }));
  };

  const handleInputChange = (setter: (val: string) => void, field: string, value: string) => {
    setter(value);

    if (fieldErrors[field]) {
      const newErrors = { ...fieldErrors };
      delete newErrors[field];
      setFieldErrors(newErrors);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setIsLoading(true);
    
    let hasError = false;
    const newErrors: { [key: string]: string } = {};

    if (!email.includes("@")) {
      newErrors.email = "Digite um e-mail válido.";
      hasError = true;
    }

    if (password.length < 8) {
      newErrors.password = "A senha deve ter no mínimo 8 caracteres.";
      hasError = true;
    }
    
    if (!isLogin) {
      if (!name) {
        newErrors.name = "O nome é obrigatório";
        hasError = true;
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "As senhas não coincidem.";
        hasError = true;
      }
    }

    if (hasError) {
      setFieldErrors(newErrors);
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
        throw new Error(data.message || "Erro na requisição");
      }

      if (isLogin) {
        const { accessToken, refreshToken } = data.data;
        
        Cookies.set("framehub_token", accessToken, { expires: 1, secure: true, sameSite: 'strict' });

        Cookies.set("framehub_refresh_token", refreshToken, { expires: 7, secure: true, sameSite: 'strict' });

        toast.success("Login realizado com sucesso!");
        setIsExiting(true);

        setTimeout(() => {
          window.location.href = "/";
        }, 800);

      } else {
        setShowSuccess(true);

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setShowPassword({ main: false, confirm: false });

        setTimeout(() => {
            setShowSuccess(false);
            setIsLogin(true);
        }, 3000);
      }

    } catch (err: unknown){
      let errorMsg = "Ocorreu um erro inesperado.";
      if (err instanceof Error) errorMsg = err.message;

      const newBackErrors: { [key: string]: string } = {};
      const lowerMsg = errorMsg.toLowerCase();

      if (lowerMsg.includes("senha")) {
        newBackErrors.password = errorMsg;
      } else if (lowerMsg.includes("email") || lowerMsg.includes("usuário") ||
        lowerMsg.includes("user")) {
        newBackErrors.email = errorMsg;
      } else if (lowerMsg.includes("nome")) {
        newBackErrors.name = errorMsg;
      }
      
      if (Object.keys(newBackErrors).length > 0) {
        setFieldErrors(newBackErrors);
      } else {
        toast.error(errorMsg);
      }

    } finally {
      if (!isLogin && !showSuccess) setIsLoading(false);
      if (isLogin && !isExiting) setIsLoading(false);
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

        
          {!showSuccess && (
             <h2 key={isLogin ? "title-login" : "title-register"} 
             className={styles.formFade}>{isLogin ? "Entrar" : "Criar conta"}</h2>
          )}
          
          {showSuccess ? (
            <div className={styles.successView}>
                <MdCheckCircle size={80} color="#46d369" className={styles.successIcon} />
                <h3>Conta Criada!</h3>
                <p>Redirecionando para o login...</p>
            </div>
          ) : (
          <form onSubmit={handleSubmit} autoComplete="off">

            <div key={isLogin ? "login" : "register"} className={styles.formFade}>

              {!isLogin && (
                <>
                  <input required type="text" placeholder="Nome completo"
                  autoComplete="name" className={`${styles.inputBox}
                  ${fieldErrors.name ? styles.error : ''}`}
                  value={name} onChange={(e) => 
                  handleInputChange(setName, 'name', e.target.value)} />
                  {fieldErrors.name && <span className={styles.errorMessage}>
                    {fieldErrors.name} </span>}
                </>  
              )} 
              
              <input required type="email" placeholder="Email"
              autoComplete="username" className={`${styles.inputBox}
              ${fieldErrors.email ? styles.error : ''}`} value={email}
              onChange={(e) => handleInputChange(setEmail, 'email', e.target.value)} />
              {fieldErrors.email && <span className={styles.errorMessage}>
                {fieldErrors.email}</span>}

              <div className={styles.passwordWrapper}>
                <input required type={showPassword.main ? "text" : "password"}
                placeholder="Senha" autoComplete={isLogin ? "current-password"
                  : "new-password"} className={`${styles.inputBox}
                  ${fieldErrors.password ? styles.error : ''}`}
                  value={password} onChange={(e) =>
                  handleInputChange(setPassword, 'password', e.target.value)} />

                  <button type="button" className={styles.eyeButton}
                  onClick={() => toggleEye('main')}>
                    {showPassword.main ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </button>
              </div>
              {fieldErrors.password && <span className={styles.errorMessage}>
                {fieldErrors.password}</span>}

              {!isLogin && (
                <>
                  <div className={styles.passwordWrapper}>
                    <input required type={showPassword.confirm ? "text" : "password"}
                    placeholder="Confirmar senha" autoComplete="new-password"
                    className={`${styles.inputBox} ${fieldErrors.confirmPassword
                    ? styles.error : ''}`} value={confirmPassword} onChange={(e)=> 
                    handleInputChange(setConfirmPassword, 'confirmPassword', e.target.value)} />

                    <button type="button" className={styles.eyeButton}
                    onClick={() => toggleEye('confirm')}>
                      {showPassword.confirm ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                  </div>
                  
                  {fieldErrors.confirmPassword && <span className={styles.errorMessage}>
                    {fieldErrors.confirmPassword}</span>}
                </>
              )}

              <button type="submit" className={styles.submitLogin} disabled={isLoading}>
                {isLoading ? "Carregando..." : (isLogin ? "Entrar" : "Cadastrar")}
              </button>

            </div>

            <p>OU</p>
            
            <button type="button" className={styles.switchRegister} 
              onClick={toggleAuthMode}>{isLogin ? "Registre-se" : "Fazer Login"}
            </button>

          </form>
          )}
      </div>

      <div className={`${styles.transitionOverlay} ${isExiting ? styles.active : ''}`} />
    </main>
  );
}