"use client"

import styles from "./Footer.module.css"
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
    return(
        <footer className={styles.footerContainer}>
            
            <div className={styles.contentBox}>
                <div className={styles.githubLinks}>
                    <Link href="https://github.com/rrafaum/framehub" target="_blank"
                    className={styles.githubFrontend} title="Repositório Front-End"><FaGithub /> <span className={styles.repoLabel}>Front</span></Link>

                    <div className={styles.divider}></div>

                    <Link href="https://github.com/JorgeBublitz/TrackFlix_API" target="_blank"
                    className={styles.githubBackend} title="Repositório Back-End"><FaGithub /> <span className={styles.repoLabel}>Back</span></Link>
                </div>

                <div className={styles.contentLinksContainer}>
                    <Link href="/" className={styles.linkItem}>Início</Link>
                    <Link href="/movies" className={styles.linkItem}>Filmes</Link>
                    <Link href="/series" className={styles.linkItem}>Séries</Link>
                    <Link href="/community" className={styles.linkItem}>Comunidade</Link>
                </div>
            </div>

            <div className={styles.copyrightBox}>
                <small>
                    Copyright&copy; 2025 | Designed by
                    <Link href="https://github.com/rrafaum" target="_blank"
                    className={styles.githubDesigned}>rrafaum</Link>
                </small>    
            </div>

        </footer>
    );
}