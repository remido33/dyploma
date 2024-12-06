import backendApi from '@/utils/backendApiInstance';
import { handleErrors } from '@/utils/errorHandler';
import { NextRequest, NextResponse } from 'next/server';

async function getStoresHandler(req: NextRequest) {
    const cookies = req.cookies;
    const { value: userId }: any = cookies.get('userId');
    const storeId = cookies.get('storeId')?.value;
    const { data } = await backendApi.get(`/user/${userId}/stores`);

    const response = NextResponse.json(data, { status: 200 });

    if(!storeId && data.length > 0) {
        response.cookies.set('storeId', data[0].id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
    };

    return response;
};


export const GET = handleErrors(getStoresHandler);
