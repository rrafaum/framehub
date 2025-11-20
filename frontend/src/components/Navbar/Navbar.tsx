"use client";

import Link from "next/link";
import Image from "next/image";
import NavItem, { NavItemInterface } from "../NavItem/NavItem";
import styles from "./Navbar.module.css";
import { usePathname } from "next/navigation";
import { MdAccountCircle } from "react-icons/md";

export default function Navbar() {
    
    const items: NavItemInterface[] = [
        { url: "/", label: "Início" },
        { url: "/movies", label: "Filmes" },
        { url: "/series", label: "Séries"  },
    ]

    const pathname = usePathname();

    return (
        <header>
            <nav className={styles.navbar}>
                <Link href="/" className={styles.logo}>
                    <Image src="/logo.png" width={100} height={100} alt="Logo FrameHub"/>
                    <p>FrameHub</p>
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

                    <Link href="/profile">
                        <button className={styles.btnAccount}>
                            <MdAccountCircle />
                        </button>
                    </Link>
                </ul>

            </nav>
        </header>
    )
}