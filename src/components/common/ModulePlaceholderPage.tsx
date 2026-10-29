import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, CheckCircle2, ListFilter } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

export interface ModulePlaceholderPageProps {
  moduleName: string;
  tagline: string;
  description: string;
  phaseNumber: number;
  phaseTitle: string;
  icon: React.ReactNode;
  plannedFeatures: string[];
}

export const ModulePlaceholderPage: React.FC<ModulePlaceholderPageProps> = ({
  moduleName,
  tagline,
  description,
  phaseNumber,
  phaseTitle,
  icon,
  plannedFeatures,
}) => {
  const navigate = useNavigate();

  return (
    <div className="py-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Return to Observatory
        </Button>
      </div>

      {/* Main Header Card */}
      <Card className="p-8 border-[#1D2A44] shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#20D9F2]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#141D30]">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-[#060B19] border border-[#20D9F2]/30 text-[#20D9F2] shadow-[0_0_16px_rgba(32,217,242,0.15)]">
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="cyan" size="sm">
                  {moduleName}
                </Badge>
                <Badge variant="outline" size="sm">
                  Phase {phaseNumber} Roadmap
                </Badge>
              </div>
              <h1 className="font-headline text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F7FF]">
                {tagline}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#FFB45B] bg-[#FFB45B]/10 border border-[#FFB45B]/30 px-3 py-1.5 rounded-lg font-semibold uppercase">
              Scheduled for {phaseTitle}
            </span>
          </div>
        </div>

        <div className="py-6 space-y-4">
          <p className="font-body text-sm text-[#98A7BF] leading-relaxed">
            {description}
          </p>

          <div className="p-5 rounded-xl bg-[#060B19]/70 border border-[#141D30]">
            <h3 className="font-headline text-xs uppercase tracking-wider font-semibold text-[#F5F7FF] mb-3 flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-[#20D9F2]" />
              Architectural Specifications & Planned Capabilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {plannedFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 text-xs text-[#98A7BF] font-body"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#20D9F2] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#141D30] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs text-[#98A7BF]">
            Under active development in accordance with the 8-Phase Master Roadmap.
          </span>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/')}
            icon={<Compass className="w-4 h-4" />}
          >
            Explore Active Observatory
          </Button>
        </div>
      </Card>
    </div>
  );
};
