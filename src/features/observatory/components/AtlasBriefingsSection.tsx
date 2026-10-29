import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Satellite, ArrowRight } from 'lucide-react';
import { Briefing } from '../../../types';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { SectionHeader } from '../../../components/common/SectionHeader';

interface AtlasBriefingsSectionProps {
  briefings: Briefing[];
}

export const AtlasBriefingsSection: React.FC<AtlasBriefingsSectionProps> = ({ briefings }) => {
  const navigate = useNavigate();

  return (
    <section className="my-12">
      <SectionHeader
        icon={<Satellite className="w-5 h-5 text-[#20D9F2]" />}
        eyebrow="Astronomical Dispatches"
        title="Atlas Briefings & Telemetry Feed"
        subtitle="Recent scientific briefings and deterministic astrophysical simulations from the local intelligence repository."
        action={
          <Badge variant="gold" size="md">
            LOCAL DEMONSTRATION DATA
          </Badge>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {briefings.slice(0, 3).map((item) => (
          <Card
            key={item.id}
            glow="cyan"
            interactive
            onClick={() => navigate('/intelligence')}
            className="flex flex-col justify-between p-5 border-[#1D2A44]"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] text-[#20D9F2] uppercase font-semibold">
                  {item.sectorCode}
                </span>
                <span className="font-mono text-[10px] text-[#98A7BF]">
                  {item.timeframe}
                </span>
              </div>

              <h4 className="font-headline text-sm font-bold uppercase text-[#F5F7FF] leading-snug group-hover:text-[#20D9F2] transition-colors">
                {item.title}
              </h4>

              <p className="font-body text-xs text-[#98A7BF] mt-2 leading-relaxed line-clamp-3">
                {item.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-[#141D30] flex items-center justify-between font-mono text-[11px]">
              <span className="text-[#98A7BF]">{item.referenceCode}</span>
              <span className="text-[#20D9F2] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Inspect <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
