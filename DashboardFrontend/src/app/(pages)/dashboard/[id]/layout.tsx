"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import styles from '@/styles/dashboard.module.css';

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const getPageName = (pathname: string): string => {
    const segments = pathname.split('/');
    return segments.length > 3 ? segments[3] : 'analytics';
  };

  const pageName = getPageName(pathname);

  return (
    <>
        <div className={styles.pageName}>
            <h1>
                {pageName}
            </h1>
            <p>
                Some more infromation can be provided here
            </p>
        </div>
        {children}
    </>
  );
};

export default Layout;
