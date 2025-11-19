"use client"

import styles from "./Footer.module.css"
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
    return(
        <footer className={styles.footerContainer}>
            
            <div className={styles.contentBox}>
                <Link href="https://github.com/rrafaum/framehub" target="_blank"
                className={styles.githubProject}><FaGithub /></Link>

                <div className={styles.contentLinksContainer}>
                    <Link href="/" className={styles.linkItem}>Início</Link>
                    <Link href="/movies" className={styles.linkItem}>Filmes</Link>
                    <Link href="/series" className={styles.linkItem}>Séries</Link>
                    <Link href="/about" className={styles.linkItem}>Sobre</Link>
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