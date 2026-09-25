import Navbar from '@/components/navbar';
import VideoGenerator from '@/components/video-generator';

export default function VideoPage() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">AI Video Generator</h1>
          <p className="text-neutral-400 mt-2 text-sm">Turn text into cinematic video using Higgsfield AI.</p>
        </div>
        <VideoGenerator />
      </main>
    </div>
  );
}
