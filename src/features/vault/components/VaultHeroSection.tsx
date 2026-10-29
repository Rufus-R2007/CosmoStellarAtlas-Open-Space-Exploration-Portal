import React, { useState } from 'react';
import {
  Vault,
  ShieldCheck,
  User,
  HardDrive,
  Edit3,
  Award,
  Lock,
  X,
  Check,
} from 'lucide-react';
import { Badge } from '../../../components/common/Badge';
import { useVaultStore } from '../../../store/useVaultStore';
import { VaultStorageService } from '../../../services/vaultStorageService';

export const VaultHeroSection: React.FC = () => {
  const profile = useVaultStore((s) => s.profile);
  const updateProfile = useVaultStore((s) => s.updateProfile);
  const favorites = useVaultStore((s) => s.favorites);
  const collections = useVaultStore((s) => s.collections);
  const journalNotes = useVaultStore((s) => s.journalNotes);
  const achievements = useVaultStore((s) => s.achievements);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(profile.displayName);
  const [callsignInput, setCallsignInput] = useState(profile.callsign);
  const [bioInput, setBioInput] = useState(profile.bio || '');

  const storageFootprint = VaultStorageService.getStorageFootprint();
  const unlockedAchievementsCount = achievements.filter((a) => !!a.unlockedAt).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: nameInput.trim() || 'Cosmo Explorer',
      callsign: callsignInput.trim().toUpperCase() || 'ATLAS-01',
      bio: bioInput.trim(),
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="space-y-6">
      {/* Privacy Notice Banner */}
      <div className="flex items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-[#20D9F2]/20 bg-[#20D9F2]/5 text-xs text-gray-300">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-lg bg-[#20D9F2]/10 text-[#20D9F2] shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-white block sm:inline mr-1 font-mono">
              CLIENT-SIDE DATA SOVEREIGNTY:
            </span>
            <span>
              Your Space Vault is stored locally in this browser. It is not synchronized across devices.
              No cloud databases, external user tracking, or telemetry servers are utilized.
            </span>
          </div>
        </div>
        <Badge variant="cyan" className="shrink-0 font-mono text-[10px] hidden md:flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#20D9F2]" />
          OFFLINE SECURE
        </Badge>
      </div>

      {/* Main Profile HUD */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1528]/80 backdrop-blur-md p-6 sm:p-8">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#8565FA]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#20D9F2]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* User Callout & Identity */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#20D9F2]/50 bg-gradient-to-br from-[#8565FA]/30 to-[#20D9F2]/20 flex items-center justify-center text-white shadow-lg shadow-[#20D9F2]/10">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-[#20D9F2]" />
              </div>
              <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-[#8565FA] text-white font-mono text-[10px] font-bold border border-white/20">
                LVL {profile.level}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {profile.displayName}
                </h1>
                <Badge variant="cyan" className="font-mono text-xs">
                  {profile.callsign}
                </Badge>
                <Badge variant="gold" className="font-mono text-xs flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#FFB45B]" />
                  {profile.rank}
                </Badge>
              </div>

              <p className="text-sm text-gray-300 max-w-xl mb-3">
                {profile.bio || 'Independent astronomical researcher and orbital explorer.'}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3 h-3 text-[#20D9F2]" />
                  <span>Edit Profile</span>
                </button>

                <span className="text-[11px] font-mono text-gray-500">
                  Registered: {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-black/40 border border-white/10 p-4 rounded-xl">
            <div className="text-center p-2">
              <span className="text-xs font-mono uppercase text-gray-400 block mb-0.5">Favorites</span>
              <span className="text-xl font-bold font-mono text-[#20D9F2]">{favorites.length}</span>
            </div>
            <div className="text-center p-2">
              <span className="text-xs font-mono uppercase text-gray-400 block mb-0.5">Collections</span>
              <span className="text-xl font-bold font-mono text-[#8565FA]">{collections.length}</span>
            </div>
            <div className="text-center p-2">
              <span className="text-xs font-mono uppercase text-gray-400 block mb-0.5">Journal Logs</span>
              <span className="text-xl font-bold font-mono text-[#FFB45B]">{journalNotes.length}</span>
            </div>
            <div className="text-center p-2">
              <span className="text-xs font-mono uppercase text-gray-400 block mb-0.5">Stars</span>
              <span className="text-xl font-bold font-mono text-[#4EFA9D]">{unlockedAchievementsCount}</span>
            </div>
            <div className="text-center p-2">
              <span className="text-xs font-mono uppercase text-gray-400 block mb-0.5">Storage</span>
              <span className="text-xl font-bold font-mono text-white flex items-center justify-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-gray-400" />
                {storageFootprint.formatted}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#090F1E] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Vault className="w-5 h-5 text-[#20D9F2]" />
                <h3 className="text-base font-bold text-white">Edit Explorer Identity</h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={32}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#20D9F2] focus:outline-none"
                  placeholder="e.g. Rufus Samuel"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                  Explorer Callsign
                </label>
                <input
                  type="text"
                  value={callsignInput}
                  onChange={(e) => setCallsignInput(e.target.value)}
                  maxLength={12}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm uppercase font-mono focus:border-[#20D9F2] focus:outline-none"
                  placeholder="e.g. ATLAS-01"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                  Bio / Research Focus
                </label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  maxLength={160}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#20D9F2] focus:outline-none"
                  placeholder="Brief statement regarding observational focus..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs text-gray-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#20D9F2] text-black text-xs font-semibold hover:bg-[#1bb8ce] transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
