import { NextResponse } from 'next/server';

const MESHY_BASE = 'https://api.meshy.ai/openapi/v1/image-to-3d';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  _request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const meshyApiKey = process.env.MESHY_API_KEY;
    if (!meshyApiKey) {
      return NextResponse.json(
        { error: 'The 3D generation service is not configured.' },
        { status: 500 }
      );
    }

    const { taskId } = params;
    if (!taskId || typeof taskId !== 'string') {
      return NextResponse.json(
        { error: 'A task ID is required.' },
        { status: 400 }
      );
    }

    const res = await fetch(`${MESHY_BASE}/${taskId}?t=${Date.now()}`, {
      headers: {
        Authorization: `Bearer ${meshyApiKey}`,
        'Cache-Control': 'no-cache',
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    } as any);

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Could not retrieve task status.' },
        { status: res.status }
      );
    }

    const data = await res.json();

    const response = NextResponse.json({
      status: data.status,
      progress: data.progress ?? 0,
      modelUrls: data.model_urls ?? null,
      thumbnailUrl: data.thumbnail_url ?? null,
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong while checking the task.' },
      { status: 500 }
    );
  }
}
