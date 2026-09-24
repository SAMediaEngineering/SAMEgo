'use client';

import { Heart } from 'lucide-react';

const showcaseItems = [
  {
    image:
      'https://images.pexels.com/photos/14018284/pexels-photo-14018284.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    preset: 'Amapiano Energy',
    title: 'Midnight Drift',
    creator: '@thabiso.kgz',
    likes: 2847,
  },
  {
    image:
      'https://images.pexels.com/photos/29433729/pexels-photo-29433729.png?auto=compress&cs=tinysrgb&h=650&w=940',
    preset: 'Highveld Dusk',
    title: 'Shadow Protocol',
    creator: '@neo.render',
    likes: 1523,
  },
  {
    image:
      'https://images.pexels.com/photos/21316136/pexels-photo-21316136.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    preset: 'Crimson Studio',
    title: 'Red Canvas',
    creator: '@lumiere.fx',
    likes: 3091,
  },
  {
    image:
      'https://images.pexels.com/photos/29666773/pexels-photo-29666773.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    preset: 'Neon Bloom',
    title: 'Emerald Fog',
    creator: '@vfx.zara',
    likes: 1982,
  },
];

function formatLikes(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function CommunityShowcase() {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 pb-20">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
          <span className="text-volt">Visual Effects</span>
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Community renders generated directly on SAMEGO.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {showcaseItems.map((item) => (
          <div
            key={item.title}
            className="group relative aspect-[9/16] overflow-hidden rounded-2xl border border-neutral-800 transition-all duration-500 hover:border-neutral-600"
          >
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Preset pill */}
            <div className="absolute left-3 top-3">
              <span className="rounded-full bg-black/40 px-3 py-1.5 text-[10px] font-semibold text-white/90 backdrop-blur-md">
                {item.preset}
              </span>
            </div>

            {/* Bottom info */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3 sm:p-4">
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold text-white">{item.title}</h4>
                <p className="mt-0.5 text-xs text-neutral-400">{item.creator}</p>
              </div>
              <div className="ml-2 flex flex-shrink-0 flex-col items-center gap-1">
                <Heart className="h-4 w-4 text-neutral-400 transition-colors group-hover:text-volt" />
                <span className="text-[10px] font-medium text-neutral-500">
                  {formatLikes(item.likes)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
