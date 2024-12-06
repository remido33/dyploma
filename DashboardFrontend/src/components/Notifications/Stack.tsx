"use client";

import React, { FC } from 'react';
import styles from '@/styles/notification.module.css';
import Image from 'next/image';
import Cross from '@/public/cross_light.svg';
import { useNotifications } from './Provider';

type NotificationProps = {
    id: number;
    text: string;
    onClose: (id: number) => void;
    error: boolean | undefined;
};

const Notification: FC<NotificationProps> = ({ id, text, error, onClose }) => {
    return (
        <div className={`${styles.wrapper}`} style={{ background: error ? 'var(--red-100)' : 'var(--green-200)' }}>
            <span>{text}</span>
            <button className={styles.closeBtn} onClick={() => onClose(id)}>
                <Image src={Cross} alt="Close Notification" />
            </button>
        </div>
    );
};

const NotificationStack: FC = () => {
    const { notifications, removeNotification } = useNotifications();

    return (
        <div className={styles.stackWrapper}>
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    id={notification.id}
                    text={notification.text}
                    error={notification.error}
                    onClose={removeNotification}
                />
            ))}
        </div>
    );
};

export default NotificationStack;
