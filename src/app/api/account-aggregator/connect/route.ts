import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json(
        { error: 'Account Aggregator connect not yet implemented.' },
        { status: 501 }
    );
}
