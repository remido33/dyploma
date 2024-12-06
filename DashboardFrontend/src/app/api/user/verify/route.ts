import { NextRequest, NextResponse } from 'next/server';
import backendApi from '../../../../utils/backendApiInstance';
import { handleErrors } from '../../../../utils/errorHandler';

async function userVerifyHandler(req: NextRequest) {
    const { token } = await req.json();
    const cookies = req.cookies;
    const { value: userId }: any = cookies.get('userId');

    const { data } = await backendApi.post(`/user/${userId}/verify`, {
        token: token,
    });

    const response = NextResponse.json({ status: 204 });

    const { authToken } = data;
    
    response.cookies.set('authToken', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    return response;
}

export const POST = handleErrors(userVerifyHandler);
