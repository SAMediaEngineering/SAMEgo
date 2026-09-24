'use client';

import { useState, useEffect } from 'react';
import { Loader2, Box, Download } from 'lucide-react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';

const GlbViewer = dynamic(() => import('@/components/glb-viewer'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#080808]">
      <Loader2 className="h-8 w-8 animate-spin text-[#D4FF00]" />
    </div>
  ),
});

interface SharedModel {
  id: string;
  name: string;
  glb_url: string;
  created_at: string;
}

export default function PreviewPage({
  params,
}: {
  params: { id: string };
}) {
  const [model, setModel] = useState<SharedModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error: fetchError } = await supabase
        .from('shared_models')
        .select('*')
        .eq('id', params.id)
        .maybeSingle();

      if (fetchError || !data) {
        setError(true);
      } else {
        setModel(data);
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#080808]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D4FF00]/20 border-t-[#D4FF00]" />
        <p className="mt-4 text-sm text-neutral-500">Loading preview...</p>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#080808]">
        <Box className="h-12 w-12 text-neutral-600" />
        <h1 className="mt-4 text-lg font-bold text-white">Model not found</h1>
        <p className="mt-1 text-sm text-neutral-500">
          This preview link may have expired or is invalid.
        </p>
      </div>
    );
  }

  const proxyUrl = `/api/meshy/proxy?url=${encodeURIComponent(model.glb_url)}`;

  return (
    <div className="flex h-screen w-full flex-col bg-[#080808]">
      {/* Header bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-800/60 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4FF00]/10">
            <Box className="h-4 w-4 text-[#D4FF00]" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white sm:text-base">
              {model.name}
            </h1>
            <p className="text-[10px] text-neutral-500 sm:text-xs">
              3D Model Preview
            </p>
          </div>
        </div>
        <a
          href={proxyUrl}
          download={`${model.name.replace(/[^a-zA-Z0-9_-]/g, '_')}.glb`}
          className="flex items-center gap-2 rounded-lg bg-[#D4FF00] px-4 py-2 text-xs font-bold text-black transition-all hover:brightness-110 sm:text-sm"
        >
          <Download className="h-3.5 w-3.5" /> Download
        </a>
      </div>

      {/* Full-bleed 3D viewer */}
      <div className="relative min-h-0 flex-1">
        <GlbViewer url={proxyUrl} fullscreen />
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-center border-t border-neutral-800/60 py-2.5">
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-600">
          Built with
          <span className="font-black tracking-tighter">
            <span className="text-neutral-400">SAME</span>
            <span className="text-[#D4FF00]">GO</span>
          </span>
        </span>
      </div>
    </div>
  );
}
