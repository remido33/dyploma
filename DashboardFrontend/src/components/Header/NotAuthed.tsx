"use client";

import { FC } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import styles from "@/styles/notAuthedHeader.module.css";
import { NavigationItem } from "@/helpers/types";

const navigation: NavigationItem[] = [
    { title: 'Overview', link: '/' },
    { title: 'Contact us', link: '/contact' },
];

const NotAuthedHeader: FC = () => {

    const pathname = usePathname();

    return (
        <div className={styles.wrapper}>
            <div style={{ width: 72 }} className={styles.logo} />
            <nav>
                <ul>
                    {
                        navigation.map(({ title, link }: NavigationItem, index: number) => (
                            <li key={index}>
                                <Link 
                                    className={styles.link} 
                                    data-active={pathname === link} 
                                    href={link}
                                >
                                    {title}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </nav>
            <div>
                <Link 
                    className={styles.login} 
                    href='/login'
                >
                    Log In
                </Link>
            </div>
        </div>
    )
};

export default NotAuthedHeader;

