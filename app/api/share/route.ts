import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, glbUrl } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'A model name is required.' },
        { status: 400 }
      );
    }

    if (!glbUrl || typeof glbUrl !== 'string') {
      return NextResponse.json(
        { error: 'A GLB URL is required.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('shared_models')
      .insert({ name: name.trim(), glb_url: glbUrl })
      .select('id')
      .maybeSingle();

    if (error || !data) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Could not save the shared model.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
