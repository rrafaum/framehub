import Link from "next/link";
import styles from "./NavItem.module.css"

export interface NavItemInterface {
    url: string;
    label: string;
    isActive?: boolean;
}

export default function NavItem(props: NavItemInterface) {
    return(
        <li className={styles.navItem}>
            <Link href={props.url} className={`${styles.navLink} ${props.isActive ? 'active' : ''}`}>
                {props.label}
            </Link>
        </li>
    )
}