import { NextResponse } from 'next/server';
import { getVertexAuth } from '../../lib/vertex';

export async function GET() {
    try {
        const { projectId, accessToken } = await getVertexAuth();
        return NextResponse.json({ projectId, accessToken });
    } catch (error) {
        console.error('Auth Token Error:', error);
        return NextResponse.json({ error: 'Failed to get auth token' }, { status: 500 });
    }
}
