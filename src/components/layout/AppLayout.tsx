import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { StarfieldCanvas } from '../common/StarfieldCanvas';
import { CommandPalette } from '../common/CommandPalette';
import { ErrorBoundary } from '../common/ErrorBoundary';

export const AppLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060B19] text-[#F5F7FF] relative overflow-x-hidden selection:bg-[#20D9F2] selection:text-[#00363E]">
      {/* Dynamic Starfield Backdrop */}
      <StarfieldCanvas />

      {/* Atmospheric Ambient Glow Blobs */}
      <div
        className="fixed -top-24 right-10 w-[550px] h-[550px] rounded-full bg-[#20D9F2]/8 blur-[130px] pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="fixed top-[480px] -left-32 w-[600px] h-[600px] rounded-full bg-[#8565FA]/10 blur-[150px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Navigation Bars */}
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Command Palette Modal */}
      <CommandPalette />

      {/* Main Content Area Protected by Module-Level Error Boundary */}
      <div className="lg:pl-64 pt-16 flex flex-col min-h-screen relative z-10">
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </div>
  );
};

