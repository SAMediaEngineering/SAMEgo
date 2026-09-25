'use client';

import { useState } from 'react';
import { Play, Loader2, Video as VideoIcon } from 'lucide-react';

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError('');
    setVideoUrl('');

    try {
      const res = await fetch('/api/higgsfield', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      setVideoUrl(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Input Panel */}
      <div className="flex flex-col gap-4 rounded-xl border border-neutral-800 bg-[#0a0a0a] p-6 lg:col-span-1 h-fit">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <VideoIcon className="text-volt" size={20} />
          Prompt
        </h2>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Describe your video</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cinematic scene at sunset, 4k, photorealistic..." 
              className="w-full h-32 rounded-md border border-neutral-800 bg-black px-3 py-2 text-sm text-white focus:border-volt focus:outline-none focus:ring-1 focus:ring-volt resize-none" 
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isLoading || !prompt}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-volt px-4 py-3 font-bold text-black transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
            {isLoading ? 'Generating (~1-2 mins)...' : 'Generate Video'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>

      {/* Video Result Panel */}
      <div className="lg:col-span-2">
        <div className="relative aspect-video w-full flex items-center justify-center overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              loop 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-600">
              {isLoading ? (
                <>
                  <Loader2 className="h-12 w-12 animate-spin text-volt mb-4" />
                  <p>Crafting your cinematic masterpiece...</p>
                </>
              ) : (
                <>
                  <VideoIcon className="h-16 w-16 mb-4 opacity-50" />
                  <p>Your generated video will appear here</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
