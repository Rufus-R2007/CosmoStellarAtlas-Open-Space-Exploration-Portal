import React, { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { TimeCapsule } from '../../../../types';
import { TimeCapsuleCard } from './TimeCapsuleCard';

interface TimeCapsuleCarouselProps {
  capsules: TimeCapsule[];
}

const categories: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'All Capsules' },
  { id: 'Lunar Exploration', label: 'Lunar' },
  { id: 'Mars Exploration', label: 'Mars' },
  { id: 'Outer Solar System', label: 'Outer Worlds' },
  { id: 'Space Telescopes', label: 'Telescopes' },
  { id: 'Human Spaceflight', label: 'Crewed' },
  { id: 'Artificial Satellites', label: 'Early Satellites' },
  { id: 'Planetary Defense', label: 'Planetary Defense' },
];

export const TimeCapsuleCarousel: React.FC<TimeCapsuleCarouselProps> = ({ capsules }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCapsules = useMemo(() => {
    if (selectedCategory === 'all') return capsules;
    return capsules.filter((c) => c.category === selectedCategory);
  }, [capsules, selectedCategory]);

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141D30] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[#8565FA] mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="font-telemetry text-xs uppercase tracking-widest font-semibold">
              Curated Cosmic Time Capsules // Feature 2
            </span>
          </div>
          <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-[#F5F7FF]">
            Historical Time Capsules
          </h3>
          <p className="font-body text-xs text-[#98A7BF] mt-0.5">
            Key turning points in astronautics and planetary exploration preserved in chronological dossiers
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none self-start sm:self-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-headline font-bold uppercase transition-colors shrink-0 border ${
                selectedCategory === cat.id
                  ? 'bg-[#8565FA] text-[#F5F7FF] border-[#8565FA] shadow-lg shadow-[#8565FA]/20'
                  : 'bg-[#060B19] border-[#141D30] text-[#98A7BF] hover:text-[#F5F7FF] hover:bg-[#10182B]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCapsules.map((capsule) => (
          <TimeCapsuleCard key={capsule.id} capsule={capsule} />
        ))}
      </div>
    </div>
  );
};
