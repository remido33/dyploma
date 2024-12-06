"use client";

import { FC, useEffect, useState } from "react";
import { NavigationItem } from "@/helpers/types";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DoubleArrows from '@/public/double_arrows.svg';
import Image from 'next/image';
import AccountsModal from './AccountsModal';
import styles from "@/styles/authedHeader.module.css";
import nextApi from "@/utils/nextApi";
import { useNotifications } from "@/components/Notifications/Provider";

type Props = {
    storeId: string | undefined,
}

const AuthedHeader: FC<Props> = ({ storeId }) => {
    
    const pathname = usePathname();
    const { pushNotification } = useNotifications();
    const [accounts, setAccounts] = useState([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    
    const getAccounts = async () => {
        try {
            const { data: accounts } = await nextApi.get(`/api/user/stores`);
            setAccounts(accounts);
        }
        catch(error: any) {
            pushNotification(error.message, true)
        }
    };

    useEffect(() => {
        getAccounts();
    }, []);

    if(accounts.length > 0) {

        const selectedCacheStore = storeId && accounts.find(({ id }) => id === parseInt(storeId));
        const { id, account_name: accountName, store_name: storeName } = selectedCacheStore ? selectedCacheStore : accounts[0];

        if(!selectedCacheStore) {
            nextApi.post('/api/store/change', { 
                storeId: id,       
            }, { withCredentials: true })
                .then(() => window.location.href = `/dashboard/${id}`);
        }
        
        const navigation: NavigationItem[] = [
            { title: 'Analytics', link: `/dashboard/${id}` },
            { title: 'Settings', link: `/dashboard/${id}/settings` },
        ];
        
        localStorage.setItem('storeName', storeName);
        
        return (
            <>
                <AccountsModal 
                    accounts={accounts}
                    visible={modalVisible}
                    closeModal={() => setModalVisible(false)}
                />
                <div className={styles.wrapper}>
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
                    <div style={{ marginTop: -8 }}>
                        <div className={styles.account}>
                            <span className={styles.user}>
                                rakshayaroslav37
                            </span>
                            <button className={styles.selector} onClick={() => setModalVisible(true)}>
                                <span className={styles.name}>
                                    {accountName}
                                </span>
                                <div className={styles.arrows}>
                                    <Image src={DoubleArrows} alt="Select account" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className={styles.placeholder}>
            <div />
        </div>
    )
};

export default AuthedHeader;