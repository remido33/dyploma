import { NextRequest, NextResponse } from 'next/server';
import { handleErrors } from '../../../../utils/errorHandler';

async function changeStoreHandler(req: NextRequest) {
    
    const { storeId } = await req.json();

    const response = NextResponse.json({ status: 204 });

    if(storeId) {
        response.cookies.set('storeId', storeId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
    };

    return response;
};


export const POST = handleErrors(changeStoreHandler);
