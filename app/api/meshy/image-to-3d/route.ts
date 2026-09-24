import { NextResponse } from 'next/server';

const MESHY_API_URL = 'https://api.meshy.ai/openapi/v1/image-to-3d';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl } = body;

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json(
        { error: 'An image URL is required.' },
        { status: 400 }
      );
    }

    const meshyApiKey = process.env.MESHY_API_KEY;
    if (!meshyApiKey) {
      return NextResponse.json(
        { error: 'The 3D generation service is not configured.' },
        { status: 500 }
      );
    }

    const meshyResponse = await fetch(MESHY_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${meshyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        ai_model: 'meshy-5',
        enable_pbr: true,
      }),
    });

    if (!meshyResponse.ok) {
      const errorBody = await meshyResponse.text().catch(() => '');
      console.error('Meshy API error:', meshyResponse.status, errorBody);
      return NextResponse.json(
        { error: 'The 3D generation service could not process this request.' },
        { status: 500 }
      );
    }

    const meshyData = await meshyResponse.json();
    const taskId = meshyData?.result;

    if (!taskId) {
      return NextResponse.json(
        { error: 'The 3D generation service returned an unexpected response.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ taskId }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
