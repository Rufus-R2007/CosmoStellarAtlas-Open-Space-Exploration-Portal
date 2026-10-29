import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from '../features/notfound/NotFoundPage';
import { ErrorState } from '../components/common/ErrorState';
import { StatCard } from '../components/common/StatCard';
import { Globe } from 'lucide-react';

describe('UI Components & Error Handling (Requirement 5, 6)', () => {
  it('Requirement 5: unknown routes show a proper not-found page with recovery action', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-non-existent-sector']}>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    expect(screen.getByText(/ERROR 404/i)).toBeInTheDocument();
    expect(screen.getByText(/Celestial Vector Not Found/i)).toBeInTheDocument();
    expect(screen.getByText(/Return to Observatory/i)).toBeInTheDocument();
  });

  it('Requirement 6: simulated provider errors display safe UI feedback with retry', () => {
    const handleRetry = vi.fn();

    render(
      <ErrorState
        title="Simulated Telemetry Failure"
        message="Controlled fault injected for verification."
        onRetry={handleRetry}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Simulated Telemetry Failure')).toBeInTheDocument();
    expect(screen.getByText('Controlled fault injected for verification.')).toBeInTheDocument();

    const retryBtn = screen.getByText(/Re-establish Uplink/i);
    expect(retryBtn).toBeInTheDocument();
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('StatCard renders label, value, unit, and badge correctly', () => {
    render(
      <StatCard
        label="Planets Cataloged"
        value={8}
        unit="Major Worlds"
        subtext="Active Ephemerides"
        badgeText="100% ONLINE"
        icon={<Globe data-testid="globe-icon" />}
        glow="cyan"
      />
    );

    expect(screen.getByText('Planets Cataloged')).toBeInTheDocument();
    expect(screen.getByText('Major Worlds')).toBeInTheDocument();
    expect(screen.getByText('Active Ephemerides')).toBeInTheDocument();
    expect(screen.getByText('100% ONLINE')).toBeInTheDocument();
    expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
  });
});
