import { FC, useState } from "react";
import Modal from '@/components/Modal';
import Image from 'next/image';
import ShopifyLogo from '@/public/shopify_logo.svg';
import styles from "@/styles/authedHeader.module.css";
import { useRouter } from 'next/navigation';
import nextApi from "@/utils/nextApi";

type AccountItem = {
    id: number,
    store_name: string,
}

type Props = {
    accounts: AccountItem[],
    visible: boolean,
    closeModal: () => void,
}

const AccountsModal: FC<Props> = ({ accounts, visible, closeModal }) => {

    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const filteredAccounts = accounts.filter(account =>
        account.store_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onClick = async (id: number) => {
        
       try {
            await nextApi.post('/api/store/change', { 
                storeId: id,       
            }, { withCredentials: true });

            window.location.href = `/dashboard/${id}`;
       }
       catch(err) {
            alert('Oops! Cannot open a store. Try to refresh the page.')
       }
    }

    return (
        <Modal 
            isOpen={visible} 
            onClose={closeModal}
        >
            <div className={styles.modal}>
                <input 
                    placeholder="Search for store" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <ul>
                    {filteredAccounts?.length === 0 && (
                        <div className={styles.noResults}>No stores found</div>
                    )}
                    {
                        filteredAccounts.map(({ id, name }: AccountItem) => (
                            <li key={id} onClick={() => onClick(id)}>
                                <div className={styles.accountLogo}>
                                    <Image src={ShopifyLogo} alt="Shopify Logo" />
                                </div>
                                <span>{name}</span>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </Modal>
    )
};

export default AccountsModal;
