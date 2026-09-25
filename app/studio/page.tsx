import Navbar from '@/components/navbar';
import LiveStudio from '@/components/live-studio';

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Broadcast Studio</h1>
          <p className="text-neutral-400 mt-2 text-sm">Stream directly to Twitch, Kick, and YouTube simultaneously without OBS.</p>
        </div>
        <LiveStudio />
      </main>
    </div>
  );
}