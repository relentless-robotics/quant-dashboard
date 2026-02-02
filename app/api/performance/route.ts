import { NextResponse } from 'next/server';
import { getAllRuns, getAggregatedStats } from '@/lib/dataLoader';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const system = searchParams.get('system') || undefined;
    const mode = searchParams.get('mode') || undefined;
    const timeframe = searchParams.get('timeframe') || undefined;

    const runs = getAllRuns({ system, mode, timeframe });
    const stats = getAggregatedStats(runs);

    return NextResponse.json({
      success: true,
      data: {
        runs,
        stats,
        count: runs.length
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to load performance data'
    }, { status: 500 });
  }
}
