import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    const parsed = new URL(targetUrl);
    if (parsed.hostname !== 'assets.meshy.ai') {
      return new NextResponse('Forbidden origin', { status: 403 });
    }
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return new NextResponse('Failed to fetch asset from Meshy', { status: response.status });
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'model/gltf-binary',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
        'Content-Disposition': 'inline; filename="model.glb"',
      },
    });
  } catch {
    return new NextResponse('Internal Proxy Error', { status: 500 });
  }
}
