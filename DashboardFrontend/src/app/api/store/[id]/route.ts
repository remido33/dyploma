import { NextRequest, NextResponse } from 'next/server';
import { handleErrors } from '@/utils/errorHandler';
import backendApi from '@/utils/backendApiInstance';

async function updateStoreHandler(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const id = pathname.split('/').pop();
    const { update } = await req.json();
    const { data } = await backendApi.patch(`/store/${id}`, update);

    return NextResponse.json(data, { status: 200 });
};

async function getStoreHandler(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const id = pathname.split('/').pop();
    const { data } = await backendApi.get(`/store/${id}`);
    
    const response = NextResponse.json(data, { status: 200 });

    return response;
};

export const PATCH = handleErrors(updateStoreHandler);
export const GET = handleErrors(getStoreHandler);
