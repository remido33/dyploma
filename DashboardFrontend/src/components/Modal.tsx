import React, { FC, ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';
import Cross from '@/public/cross.svg';
import styles from '@/styles/modal.module.css';

type Props = {
    isOpen: boolean,
    onClose: () => void,
    children: ReactNode,
}

const Modal: FC<Props> = ({ isOpen, onClose, children }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 300); // Match the duration of the CSS animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <>
            <div
                className={`${styles.modalOverlay} ${isOpen ? styles.fadeIn : styles.fadeOut}`}
                onClick={onClose}
            ></div>
            <div
                className={`${styles.modalContent} ${isOpen ? styles.popup : styles.popdown}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.modalClose} onClick={onClose}>
                    <Image src={Cross} alt="Close Modal" />
                </button>
                {children}
            </div>
        </>
    );
};

export default Modal;
