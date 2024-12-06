import { NextRequest, NextResponse } from 'next/server';
import backendApi from '../../../../utils/backendApiInstance';
import { handleErrors } from '../../../../utils/errorHandler';

async function userLoginHandler(req: NextRequest) {
    const { email } = await req.json();

    const { data } = await backendApi.post('/user/login', {
        email: email,
    });

    const { userId } = data;

    const response = NextResponse.json({ status: 204 });

    response.cookies.set('userId', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    return response;
}

export const POST = handleErrors(userLoginHandler);
