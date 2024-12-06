import { NextResponse, NextRequest } from 'next/server';

export function handleErrors(fn: (req: NextRequest) => Promise<NextResponse>) {
    return async (req: NextRequest) => {
        try {
            return await fn(req);
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
                const { status, message } = err as { status: number; message: string };
                return NextResponse.json({ message }, { status });
            }
            console.log(err);
            return NextResponse.json({ message: 'An unknown error occurred.' }, { status: 500 });
        }
    };
}
