"use client";

import { FC } from "react";
import styles from '@/styles/login.module.css';
import nextApi from "@/utils/nextApi";
import { useNotifications } from '@/components/Notifications/Provider';
import InputWithCta from "@/components/InputWithCta";
import setInitialStore from "@/helpers/setInitialStore";

const Verify: FC = () => {

    const { pushNotification } = useNotifications();

    const onVerify = async (token: string) => {
        try {

            await nextApi.post('/api/user/verify', { 
                token: token.trimEnd(),
            }, { withCredentials: true });
            
            const { ok, message } = await setInitialStore();  

            if(!ok) pushNotification(message, true)
        }
        catch (err: any) {
            pushNotification(err.message, true)
        }
    }

    return (
       <div className={`${styles.wrapper} ${styles.verifyPage}`}>
            <h1>Verify token</h1>
            <p>Provide Authenticator token</p>
            
            <InputWithCta 
                label="token"
                onSubmit={(value) => onVerify(value)}
                placeholder="Token"
                ctaText="Verify"
            />
        </div>
    )
};

export default Verify;