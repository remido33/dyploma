"use client";

import { FC } from 'react';
import styles from '@/styles/loading.module.css';

const Loading: FC = () => {

    const preventClick = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div onClick={(e) => preventClick(e)} className={styles.wrapper}>
            <div className={styles.spinner}></div>
        </div>
    );
};

export default Loading;
