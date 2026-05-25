import { NextResponse } from 'next/server';
import { clearAllData } from '@/lib/firestore-service';

export async function POST(request: Request) {
    try {
        const isProduction = process.env.NODE_ENV === 'production';
        const authHeader = request.headers.get('Authorization');
        const secret = process.env.ADMIN_CLEAR_DB_SECRET;

        // In production, require a secure admin token to clear data
        if (isProduction) {
            if (!secret || authHeader !== `Bearer ${secret}`) {
                return NextResponse.json(
                    { error: 'Unauthorized: Cleardown in production requires a valid ADMIN_CLEAR_DB_SECRET bearer token.' },
                    { status: 401 }
                );
            }
        }

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

// Block GET requests to prevent automated bots, build tools, and web crawlers
// from clearing database records on Vercel deployment.
export async function GET() {
    return NextResponse.json(
        { 
            error: 'Method Not Allowed', 
            message: 'Database clearing must be performed via POST. GET requests are blocked to prevent automated crawlers and deployment screenshotters from wiping data.' 
        },
        { status: 405 }
    );
}

