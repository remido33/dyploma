import React, { FC } from 'react';
import styles from "@/styles/footer.module.css";
import Link from 'next/link';

const Footer: FC = () => {

    return (
        <footer className={styles.wrapper}>
           <Link href='#'>Terms of Service</Link>
           <Link href='#'>Privacy Policy</Link>
        </footer>
    );
};

export default Footer;