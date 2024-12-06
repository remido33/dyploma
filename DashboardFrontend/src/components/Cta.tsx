import { CSSProperties, FC, ReactNode } from "react";
import Link from 'next/link';
import styles from '@/styles/cta.module.css';

type Props = {
    variant: 'black' | 'white' | 'transparent' | 'delete'
    href?: string,
    disabled?: boolean,
    onClick?: () => void,
    children: ReactNode,
    style?: CSSProperties,
    type?: string,
}

const Cta: FC<Props> = ({ variant, href, onClick, children, style, disabled }) => {

    const variantClassNames: { [key: string]: string } = {
        black: styles.blackCta,
        white: styles.whiteCta,
        transparent: styles.transparentCta,
        delete: styles.deleteCta,
    };

    const className = variantClassNames[variant];

    return href ? 
        <Link 
            className={`${className} ${styles.cta}`}
            href={href}
            style={style}
        >
            {children}
        </Link>
        : 
        <button 
            className={`${className} ${styles.cta}`}
            onClick={onClick}
            style={style}
            disabled={disabled}
        >
            {children}
        </button>
};

export default Cta;