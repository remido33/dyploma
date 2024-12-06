'use client';

import React, { FC } from 'react';
import NotAuthedHeader from './NotAuthed';
import AuthedHeader from './Authed';
import { usePathname } from 'next/navigation'

type Props = {
    authenticated: boolean,
    storeId: string | undefined,
}

const ClientWrapper: FC<Props> = ({ authenticated, storeId, }) => {

    const pathname = usePathname();
    const isDashboardPath = pathname.startsWith('/dashboard');
    return (
        <header>
            {!isDashboardPath && <NotAuthedHeader />}
            {authenticated && isDashboardPath && <AuthedHeader storeId={storeId} />}
        </header>
    )
};

export default ClientWrapper;