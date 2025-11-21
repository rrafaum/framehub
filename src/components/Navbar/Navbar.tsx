"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import NavItem, { NavItemInterface } from "../NavItem/NavItem";
import styles from "./Navbar.module.css";
import { usePathname, useRouter } from "next/navigation";
import { MdAccountCircle, MdPerson, MdLogout } from "react-icons/md";
import Cookies from "js-cookie";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [showMenu, setShowMenu] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent){
            if(menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])
    
    const items: NavItemInterface[] = [
        { url: "/", label: "Início" },
        { url: "/movies", label: "Filmes" },
        { url: "/series", label: "Séries"  },
    ]

    const handleLogout = () => {
        Cookies.remove("framehub_token");
        router.push("/login");
        router.refresh();
    }

    return (
        <header>
            <nav className={styles.navbar}>
                <Link href="/" className={styles.logo}>
                    <Image src="/framehub-logo.png" width={250} height={100} alt="Logo FrameHub"/>
                </Link>

                <ul className={`${styles.navItems}`}>
                    {items.map((item, index) => (
                        <NavItem
                            key = {index}
                            url = {item.url}
                            label = {item.label}
                            isActive = {pathname === item.url}
                        />
                    ))}

                    <div className={styles.profileContainer} ref={menuRef}>
                        
                        <button className={`${styles.btnAccount} ${showMenu ? styles.active : ''}`} onClick={() => setShowMenu(!showMenu)}>
                            <MdAccountCircle />
                        </button>

                        {showMenu && (
                            <div className={styles.dropdownMenu}>
                                <div className={styles.menuHeader}>Minha Conta</div>

                                <Link href="/profile" className={styles.dropdownItem} onClick={() => setShowMenu(false)}><MdPerson size={20} /><span>Perfil</span></Link>

                                <div className={styles.separator}></div>

                                <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutBtn}`}>
                                    <MdLogout size={20} />
                                    <span>Sair</span>
                                </button>
                            </div>
                        )}
                    </div>
                </ul>
            </nav>
        </header>
    )
}