"use client"

import { useState } from "react";
import Link from "next/link";
import styles from "./Auth.module.css";
import Image from "next/image";

export default function Auth() {

  const [isLogin, setIsLogin] = useState(true);
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  }

    return(
      <main className={styles.mainContainer}>

        <Image src="/background.jpg" alt="Background" fill priority quality={100}
        style={{ objectFit: "cover", objectPosition: "center", zIndex: -2 }} />
        <div className={styles.overlay} />

        <header className={styles.header}>
          <Link href="/">
            <Image src="/framehub-logo.png" width={250}
            height={80} alt="Framehub Logo" />
          </Link>
        </header>

        <div className={styles.loginBox}>

          <div key={isLogin ? "login" : "register"} className={styles.formFade}>
            <h2 key={isLogin ? "title-login" : "title-register"} className={styles.formFade}>{isLogin ? "Entrar" : "Criar conta"}</h2>
            
            <form onSubmit={(e) => e.preventDefault}>

              
                <input required type="text" placeholder="Nome"
                className={styles.inputBox} />
                {!isLogin && (<input required type="email" placeholder="E-mail"
                className={styles.inputBox} />)}
                <input required type="password" placeholder="Senha"
                className={styles.inputBox} />
                {!isLogin && (<input required type="password" placeholder="Confirmar senha"
                className={styles.inputBox} />)}
                <button type="submit" className={styles.submitLogin}>{isLogin ? "Entrar" : "Cadastrar"}</button>
              

              <p>OU</p>

              <button type="button" className={styles.switchRegister} onClick={toggleAuthMode}>{isLogin ? "Registre-se" : "Fazer Login"}</button>
            </form>
          </div>

        </div>

      </main>
    );
}