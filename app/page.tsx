import Navbar from '@/components/navbar';
import HeroCarousel from '@/components/hero-carousel';
import ModelSelector from '@/components/model-selector';
import CommunityShowcase from '@/components/community-showcase';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />
      <main>
        <HeroCarousel />
        <ModelSelector />
        <CommunityShowcase />
      </main>
    </div>
  );
}
