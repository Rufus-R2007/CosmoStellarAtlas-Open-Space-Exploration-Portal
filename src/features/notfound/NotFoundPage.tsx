import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, AlertOctagon, ArrowLeft } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20 max-w-xl mx-auto text-center animate-in fade-in duration-300" data-testid="not-found-page">
      <Card className="p-10 border-[#1D2A44] shadow-2xl flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <AlertOctagon className="w-10 h-10" />
        </div>

        <span className="font-mono text-xs text-[#20D9F2] uppercase tracking-widest font-semibold">
          ERROR 404 // TRAJECTORY DRIFT
        </span>

        <h1 className="font-headline text-3xl font-bold uppercase tracking-tight text-[#F5F7FF]">
          Celestial Vector Not Found
        </h1>

        <p className="font-body text-xs sm:text-sm text-[#98A7BF] leading-relaxed max-w-md">
          The coordinates or astronomical path you requested do not correlate with any cataloged ephemeris or module in the local atlas repository.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/')}
            icon={<Compass className="w-4 h-4" />}
          >
            Return to Observatory
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
        </div>
      </Card>
    </div>
  );
};

