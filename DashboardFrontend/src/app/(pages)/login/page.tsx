"use client";

import { FC } from "react";
import styles from '@/styles/login.module.css';
import nextApi from "@/utils/nextApi";
import { useRouter } from 'next/navigation';
import InputWithCta from "@/components/InputWithCta";
import { useNotifications } from '@/components/Notifications/Provider';

const Login: FC = () => {
    const { pushNotification } = useNotifications();
    const router = useRouter();

    const onLogin = async (email: string) => {
        try {
            await nextApi.post('/api/user/login', {
                email: email.trimEnd(),
            }, { withCredentials: true });

            router.push('/verify');
        }
        catch (err: any) {
           
            pushNotification(err.message, true)
        }
    }

    return (
       <div className={styles.wrapper}>
            <h1>Login to dashboard</h1>
            <p>Provide email to proceed</p>

            <InputWithCta 
                label="email"
                onSubmit={(value) => onLogin(value)}
                placeholder="Email"
                ctaText="Log in"
            />
        </div>
    )
};

export default Login;