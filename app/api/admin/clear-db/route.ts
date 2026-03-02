import { NextResponse } from 'next/server';
import { clearAllData } from '@/lib/firestore-service';

export async function GET() {
    try {
        const result = await clearAllData();
        return NextResponse.json({
            message: 'Database cleared successfully',
            ...result
        });
    } catch (error) {
        console.error('Error in clear-db API:', error);
        return NextResponse.json(
            { error: 'Failed to clear database', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
