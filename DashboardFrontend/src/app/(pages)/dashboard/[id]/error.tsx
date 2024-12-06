"use client";

import Cta from '@/components/Cta';
import styles from '@/styles/errorPage.module.css';
import setInitialStore from '@/helpers/setInitialStore';
import { useNotifications } from '@/components/Notifications/Provider';

const error = ({ error, reset }: { error: Error & { digest?: string, timestamp: number }, reset: () => void, }) => {

    const { pushNotification } = useNotifications();
    
    const onRefresh = async () => {
       const { ok, message } = await setInitialStore();  
       
       if(!ok) pushNotification(message, true)
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <span>{error?.timestamp ? error.message : 'Oops! Internal error. Something went wrong.'}</span>
                <div className={styles.ctas}>
                    <Cta onClick={onRefresh} variant='black'>
                        Refresh
                    </Cta>
                    <Cta variant='transparent'>
                        Contact us
                    </Cta>
                </div>
            </div>
        </div>
    )
};

export default error;