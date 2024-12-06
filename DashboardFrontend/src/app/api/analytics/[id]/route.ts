import { NextRequest, NextResponse } from 'next/server';
import backendApi from '../../../../utils/backendApiInstance';
import { handleErrors } from '../../../../utils/errorHandler';

async function getAnalyticsHandler(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const id = pathname.split('/').pop();
    const startDate = req.nextUrl.searchParams.get('startDate');
    const endDate = req.nextUrl.searchParams.get('endDate');
    const { data } = await backendApi.get(`/analytics/${id}?startDate=${startDate}&endDate=${endDate}`);

    return NextResponse.json(data, { status: 200 });
}


export const GET = handleErrors(getAnalyticsHandler);
