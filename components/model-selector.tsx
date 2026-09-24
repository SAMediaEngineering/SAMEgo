'use client';

import { Video, Box, Wand2, Layers } from 'lucide-react';

const models = [
  {
    name: 'Seedance 2.5',
    type: 'Video',
    description: 'Motion synthesis with expressive characters',
    pill: 'TOP',
    icon: Video,
  },
  {
    name: 'Kling 3.0',
    type: 'Video',
    description: 'Ultra-realistic video generation at 4K',
    pill: 'NEW',
    icon: Wand2,
  },
  {
    name: 'Soul 2.0',
    type: 'Creative',
    description: 'Artistic stylization and creative effects',
    pill: null,
    icon: Layers,
  },
  {
    name: 'Meshy 7',
    type: '3D',
    description: 'Production-ready 3D model generation',
    pill: 'HOT',
    icon: Box,
  },
];

export default function ModelSelector() {
  return (
    <section className="mx-auto mt-4 max-w-7xl px-4 sm:px-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {models.map((model) => (
          <button
            key={model.name}
            className="group relative flex flex-col justify-between rounded-xl border border-neutral-800 bg-surface p-4 text-left transition-all duration-300 hover:border-neutral-600 hover:bg-[#161616] sm:p-5"
          >
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  {model.type}
                </span>
                {model.pill && (
                  <span className="rounded-full bg-volt/10 px-2 py-0.5 text-[10px] font-bold text-volt">
                    {model.pill}
                  </span>
                )}
              </div>
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-neutral-400 transition-colors group-hover:bg-volt/10 group-hover:text-volt">
                <model.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-auto">
              <h4 className="text-sm font-bold text-white">{model.name}</h4>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500 line-clamp-2">
                {model.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
