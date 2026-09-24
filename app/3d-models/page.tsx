'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload,
  Box,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Image as ImageIcon,
  Download,
  RotateCcw,
  Link2,
  Check,
  Pencil,
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const GlbViewer = dynamic(() => import('@/components/glb-viewer'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center rounded-2xl border border-neutral-800 bg-[#111]">
      <Loader2 className="h-8 w-8 animate-spin text-volt" />
    </div>
  ),
});

type Status = 'idle' | 'generating' | 'polling' | 'complete' | 'error';

interface TaskPoll {
  status: string;
  progress: number;
  modelUrls: { glb?: string; fbx?: string; obj?: string } | null;
  thumbnailUrl: string | null;
}

export default function ThreeDModelsPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [rawGlbUrl, setRawGlbUrl] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [modelName, setModelName] = useState('Untitled Model');
  const [editingName, setEditingName] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [editingName]);

  const pollTask = useCallback(
    (id: string) => {
      const poll = async () => {
        try {
          const timestamp = Date.now();
          const res = await fetch(`/api/meshy/task/${id}?t=${timestamp}`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
          });

          if (!res.ok) {
            setStatus('error');
            setErrorMessage('Lost connection while checking progress.');
            stopPolling();
            return;
          }

          const data: TaskPoll = await res.json();

          if (data.status === 'SUCCEEDED') {
            stopPolling();
            const glbUrl = data.modelUrls?.glb;
            if (glbUrl) {
              const proxyUrl = `/api/meshy/proxy?url=${encodeURIComponent(glbUrl)}`;
              setRawGlbUrl(glbUrl);
              setModelUrl(proxyUrl);
              setProgress(100);
              setStatus('complete');
            } else {
              setStatus('error');
              setErrorMessage('The model finished but no download was available.');
            }
            return;
          }

          if (data.status === 'FAILED' || data.status === 'EXPIRED') {
            stopPolling();
            setStatus('error');
            setErrorMessage('The 3D generation did not complete. Please try again.');
            return;
          }

          setProgress(data.progress ?? 0);
          pollingRef.current = setTimeout(poll, 3000);
        } catch {
          stopPolling();
          setStatus('error');
          setErrorMessage('Lost connection while checking progress.');
        }
      };

      poll();
    },
    [stopPolling]
  );

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file (PNG, JPG, or WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image must be under 10 MB.');
      return;
    }
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleGenerate = async () => {
    if (!imagePreview) return;

    setStatus('generating');
    setErrorMessage(null);
    setTaskId(null);
    setModelUrl(null);
    setRawGlbUrl(null);
    setProgress(0);

    try {
      const res = await fetch('/api/meshy/image-to-3d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: imagePreview }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong.');
        return;
      }

      setTaskId(data.taskId);
      setStatus('polling');
      pollTask(data.taskId);
    } catch {
      setStatus('error');
      setErrorMessage('Could not reach the server. Please try again.');
    }
  };

  const handleReset = () => {
    stopPolling();
    setImagePreview(null);
    setStatus('idle');
    setTaskId(null);
    setModelUrl(null);
    setRawGlbUrl(null);
    setProgress(0);
    setErrorMessage(null);
    setModelName('Untitled Model');
    setCopied(false);
    setSharing(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleCopyLink = async () => {
    if (!rawGlbUrl || sharing) return;

    setSharing(true);

    const shareUrlPromise = fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName, glbUrl: rawGlbUrl }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.id) throw new Error('missing id');
        return `${window.location.origin}/preview/${data.id}`;
      });

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const item = new ClipboardItem({
          'text/plain': shareUrlPromise.then(
            (url) => new Blob([url], { type: 'text/plain' })
          ),
        });
        await navigator.clipboard.write([item]);
      } else {
        const url = await shareUrlPromise;
        await navigator.clipboard.writeText(url);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setErrorMessage('Could not create a shareable link.');
    } finally {
      setSharing(false);
    }
  };

  const isWorking = status === 'generating' || status === 'polling';

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Top bar */}
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 pb-2 pt-6 sm:px-6">
        <Link
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
          href="/"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      {/* Page heading */}
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 sm:pt-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-volt/10">
            <Box className="h-5 w-5 text-volt" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Image to 3D Model
            </h1>
            <p className="mt-0.5 text-sm text-neutral-500">
              Upload a reference image and generate a production-ready 3D model
            </p>
          </div>
        </div>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-surface px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-volt" />
          <span className="text-xs font-semibold text-neutral-300">
            15 tokens per generation
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Upload area */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Reference Image
            </h2>
            {!imagePreview ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`group flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 sm:min-h-[400px] ${
                  dragActive
                    ? 'border-volt bg-volt/5'
                    : 'border-neutral-700 bg-surface hover:border-neutral-500 hover:bg-[#161616]'
                }`}
              >
                <div className="flex flex-col items-center gap-4 px-6 text-center">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
                      dragActive
                        ? 'bg-volt/15 text-volt'
                        : 'bg-white/5 text-neutral-500 group-hover:bg-volt/10 group-hover:text-volt'
                    }`}
                  >
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Drop your image here
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      or click to browse -- PNG, JPG, WebP up to 10 MB
                    </p>
                  </div>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFile(e.target.files[0])
                  }
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-neutral-800 bg-surface sm:min-h-[400px]">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="h-full w-full object-contain"
                />
                {!isWorking && status !== 'complete' && (
                  <button
                    onClick={handleReset}
                    className="absolute right-3 top-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/80"
                  >
                    Change image
                  </button>
                )}
              </div>
            )}

            {/* Model Name Input */}
            {imagePreview && (
              <div className="rounded-xl border border-neutral-800 bg-surface p-4">
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                  Model Name
                </label>
                {editingName ? (
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    onBlur={() => {
                      if (!modelName.trim()) setModelName('Untitled Model');
                      setEditingName(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (!modelName.trim()) setModelName('Untitled Model');
                        setEditingName(false);
                      }
                    }}
                    maxLength={80}
                    className="w-full rounded-lg border border-neutral-700 bg-[#111] px-3 py-2 text-sm font-semibold text-white outline-none transition-colors focus:border-volt"
                  />
                ) : (
                  <button
                    onClick={() => setEditingName(true)}
                    className="group flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-2 text-left transition-colors hover:border-neutral-700 hover:bg-[#111]"
                  >
                    <span className="text-sm font-semibold text-white truncate">
                      {modelName}
                    </span>
                    <Pencil className="h-3.5 w-3.5 shrink-0 text-neutral-600 transition-colors group-hover:text-neutral-400" />
                  </button>
                )}
              </div>
            )}

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <p className="text-sm text-red-300">{errorMessage}</p>
              </div>
            )}
          </div>

          {/* Right: Output / status */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
              3D Output
            </h2>

            {status === 'complete' && modelUrl ? (
              <div className="flex flex-col gap-4">
                {/* Model name heading */}
                <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-surface px-4 py-3">
                  <Box className="h-4 w-4 shrink-0 text-volt" />
                  <h3 className="truncate text-sm font-bold text-white">
                    {modelName}
                  </h3>
                </div>

                <GlbViewer url={modelUrl} />

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={modelUrl}
                    download={`${modelName.replace(/[^a-zA-Z0-9_-]/g, '_')}.glb`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-volt py-3.5 text-sm font-bold text-black transition-all hover:brightness-110 hover:shadow-[0_0_24px_rgba(212,255,0,0.2)]"
                  >
                    <Download className="h-4 w-4" /> Download
                  </a>
                  <button
                    onClick={handleCopyLink}
                    disabled={sharing}
                    className="flex items-center justify-center gap-2 rounded-xl border border-volt/40 bg-[#111] py-3.5 text-sm font-bold text-volt transition-all hover:border-volt hover:bg-volt/5 disabled:opacity-50"
                  >
                    {sharing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : copied ? (
                      <>
                        <Check className="h-4 w-4" /> Copied!
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4" /> Share Link
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 py-3 text-sm font-semibold text-neutral-300 transition-colors hover:border-neutral-600 hover:bg-white/5"
                >
                  <RotateCcw className="h-4 w-4" /> Generate Another
                </button>
              </div>
            ) : (
              <>
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-surface sm:min-h-[400px]">
                  {status === 'idle' && !imagePreview && (
                    <div className="flex flex-col items-center gap-3 px-6 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                        <ImageIcon className="h-6 w-6 text-neutral-600" />
                      </div>
                      <p className="text-sm text-neutral-500">
                        Upload an image to start generating
                      </p>
                    </div>
                  )}
                  {status === 'idle' && imagePreview && (
                    <div className="flex flex-col items-center gap-4 px-6 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-volt/10">
                        <Box className="h-6 w-6 text-volt" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Ready to generate
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          Your 3D model will appear here
                        </p>
                      </div>
                    </div>
                  )}
                  {status === 'generating' && (
                    <div className="flex flex-col items-center gap-4 px-6 text-center">
                      <Loader2 className="h-10 w-10 animate-spin text-volt" />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Submitting to 3D engine...
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          Starting your generation
                        </p>
                      </div>
                    </div>
                  )}
                  {status === 'polling' && (
                    <div className="flex w-full flex-col items-center gap-5 px-8 text-center">
                      <Loader2 className="h-10 w-10 animate-spin text-volt" />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {progress < 50
                            ? 'Analyzing image and generating base mesh...'
                            : progress < 90
                            ? 'Refining geometry...'
                            : 'Applying textures and finalizing...'}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                          {progress < 50
                            ? 'This usually takes 1 - 3 minutes'
                            : progress < 90
                            ? 'Shaping and smoothing the 3D structure'
                            : 'Almost done!'}
                        </p>
                      </div>
                      <div className="w-full max-w-xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-neutral-400">
                            Progress
                          </span>
                          <span className="font-bold tabular-nums text-volt">
                            {progress}%
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                          <div
                            className="h-full rounded-full bg-volt transition-all duration-700 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {status !== 'complete' && (
                  <button
                    onClick={handleGenerate}
                    disabled={!imagePreview || isWorking}
                    className={`flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-300 ${
                      imagePreview && !isWorking
                        ? 'bg-volt text-black hover:brightness-110'
                        : 'cursor-not-allowed bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {isWorking ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Rendering...{' '}
                        {progress}%
                      </>
                    ) : (
                      <>
                        <Box className="h-4 w-4" /> Generate 3D Model
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
