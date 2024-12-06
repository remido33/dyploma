
import React, { FC } from 'react';
import ClientWrapper from './ClientWrapper';
import { cookies } from 'next/headers'

const Header: FC = () => {
    const cookieStore = cookies();
    const authToken = cookieStore.get('authToken');
    const authenticated = authToken;
    const storeId = cookieStore.get('storeId')?.value;
    
    return (
        <ClientWrapper 
            authenticated={!!authenticated}
            storeId={storeId}
        />
    );
};

export default Header;
