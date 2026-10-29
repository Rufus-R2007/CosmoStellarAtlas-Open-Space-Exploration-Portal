import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  FileCode,
} from 'lucide-react';
import { useVaultStore } from '../../../store/useVaultStore';
import { VaultStorageService } from '../../../services/vaultStorageService';
import { Badge } from '../../../components/common/Badge';

export const VaultBackupSection: React.FC = () => {
  const exportBackup = useVaultStore((s) => s.exportBackup);
  const importBackup = useVaultStore((s) => s.importBackup);
  const resetVault = useVaultStore((s) => s.resetVault);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [stagedBackupData, setStagedBackupData] = useState<{
    rawJson: string;
    profileName: string;
    favoritesCount: number;
    notesCount: number;
    lessonsCount: number;
  } | null>(null);

  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');

  // Reset modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetConfirmInput, setResetConfirmInput] = useState('');

  const storageFootprint = VaultStorageService.getStorageFootprint();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const validation = VaultStorageService.parseAndValidateBackup(content);
      if (validation.isValid && validation.data) {
        setStagedBackupData({
          rawJson: content,
          profileName: validation.data.profile.displayName,
          favoritesCount: validation.data.favorites.length,
          notesCount: validation.data.journalNotes.length,
          lessonsCount: validation.data.completedLessonIds.length,
        });
        setImportStatus(null);
      } else {
        setImportStatus({
          type: 'error',
          message: validation.error || 'Invalid backup file structure.',
        });
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApplyImport = () => {
    if (!stagedBackupData) return;
    const result = importBackup(stagedBackupData.rawJson, importMode);
    if (result.success) {
      setImportStatus({
        type: 'success',
        message: result.message,
      });
      setStagedBackupData(null);
    } else {
      setImportStatus({
        type: 'error',
        message: result.message,
      });
    }
  };

  const handleConfirmReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetConfirmInput.trim() !== 'RESET') return;
    resetVault();
    setIsResetModalOpen(false);
    setResetConfirmInput('');
    setImportStatus({
      type: 'success',
      message: 'Personal Space Vault successfully reset to initial default state.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-[#8565FA]" />
          <span>Local Vault Backup & Recovery</span>
          <Badge variant="cyan" className="font-mono text-xs">
            cosmostellaratlas:user:v1
          </Badge>
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Export full JSON archives of your profile, favorites, personal collections, and research journals with zero cloud dependencies.
        </p>
      </div>

      {/* Status banner if any */}
      {importStatus && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            importStatus.type === 'success'
              ? 'bg-[#20D9F2]/10 border-[#20D9F2]/30 text-cyan-200'
              : 'bg-[#FF5B5B]/10 border-[#FF5B5B]/30 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 font-mono">
            {importStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#20D9F2]" />
            ) : (
              <XCircle className="w-4 h-4 text-[#FF5B5B]" />
            )}
            <span>{importStatus.message}</span>
          </div>
          <button
            onClick={() => setImportStatus(null)}
            className="text-gray-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1528]/80 backdrop-blur-md p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-[#20D9F2]/10 text-[#20D9F2] border border-[#20D9F2]/20">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Export Vault JSON Archive</h3>
                <span className="text-xs font-mono text-gray-400">
                  Current Footprint: {storageFootprint.formatted}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              Download your entire personal vault as a formatted JSON document. The archive encapsulates
              your explorer profile, universal bookmarks, custom collections, research journal notes,
              completed learning lessons, quiz scores, and verified exploration telemetry events.
            </p>
          </div>

          <button
            onClick={exportBackup}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#20D9F2] to-[#8565FA] text-white font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-[#20D9F2]/20"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON Backup</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="rounded-2xl border border-white/10 bg-[#0B1528]/80 backdrop-blur-md p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-[#8565FA]/10 text-[#8565FA] border border-[#8565FA]/20">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Import & Restore Vault Archive</h3>
                <span className="text-xs font-mono text-gray-400">
                  Compatible with v1 Schema
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              Restore your space vault on this or another browser. You can merge the imported discoveries
              with your existing favorites and notes, or perform a complete replacement restore.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              className="hidden"
            />
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-[#8565FA]" />
            <span>Select Backup JSON File</span>
          </button>
        </div>
      </div>

      {/* Staged Backup Preview & Confirmation Modal */}
      {stagedBackupData && (
        <div className="p-5 rounded-2xl border border-[#20D9F2]/30 bg-[#0B1528] shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#20D9F2]" />
              <h4 className="text-sm font-bold text-white">
                Valid Backup Archive Staged for Import
              </h4>
            </div>
            <button
              onClick={() => setStagedBackupData(null)}
              className="text-gray-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 p-3 rounded-xl font-mono text-xs">
            <div>
              <span className="text-gray-500 block">Explorer:</span>
              <span className="text-white font-bold">{stagedBackupData.profileName}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Favorites:</span>
              <span className="text-[#20D9F2] font-bold">{stagedBackupData.favoritesCount} items</span>
            </div>
            <div>
              <span className="text-gray-500 block">Journal Notes:</span>
              <span className="text-[#FFB45B] font-bold">{stagedBackupData.notesCount} logs</span>
            </div>
            <div>
              <span className="text-gray-500 block">Lessons Passed:</span>
              <span className="text-[#8565FA] font-bold">{stagedBackupData.lessonsCount} lessons</span>
            </div>
          </div>

          {/* Import Mode Radio */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-gray-400 block">
              Choose Import Mode:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer ${
                  importMode === 'merge'
                    ? 'border-[#20D9F2] bg-[#20D9F2]/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="mt-0.5 text-[#20D9F2]"
                />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Merge with Existing Data (Recommended)
                  </span>
                  <span className="text-[11px] text-gray-400 block leading-tight mt-0.5">
                    Retains your current bookmarks and adds any new entries from the backup.
                  </span>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer ${
                  importMode === 'replace'
                    ? 'border-[#FFB45B] bg-[#FFB45B]/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="mt-0.5 text-[#FFB45B]"
                />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Complete Vault Replacement
                  </span>
                  <span className="text-[11px] text-gray-400 block leading-tight mt-0.5">
                    Overwrites local state entirely with the exact contents of the backup file.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setStagedBackupData(null)}
              className="px-4 py-2 rounded-lg border border-white/10 text-xs text-gray-300 hover:bg-white/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyImport}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#20D9F2] text-black text-xs font-semibold hover:bg-[#1bb8ce] transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Apply Import</span>
            </button>
          </div>
        </div>
      )}

      {/* Danger Zone: Reset Vault */}
      <div className="rounded-2xl border border-[#FF5B5B]/30 bg-[#FF5B5B]/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-[#FF5B5B]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Danger Zone: Reset Space Vault
            </h3>
          </div>
          <p className="text-xs text-gray-400 max-w-xl">
            Permanently clear all favorites, custom collections, research journal notes, curriculum progress,
            and exploration achievements from this browser's local storage.
          </p>
        </div>

        <button
          onClick={() => setIsResetModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF5B5B]/15 hover:bg-[#FF5B5B]/25 border border-[#FF5B5B]/40 text-[#FF5B5B] hover:text-white font-medium text-xs transition-colors shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Vault Data</span>
        </button>
      </div>

      {/* Reset Double Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-[#FF5B5B]/40 bg-[#090F1E] p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-[#FF5B5B]">
              <div className="p-2.5 rounded-xl bg-[#FF5B5B]/15">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirm Total Vault Reset</h3>
                <span className="text-xs font-mono text-[#FF5B5B]">Irreversible Local Action</span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              This action will permanently erase all local research records, saved celestial favorites,
              journal entries, completed lessons, and constellation achievements.
            </p>

            <form onSubmit={handleConfirmReset} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">
                  Type <span className="text-[#FF5B5B] font-bold">RESET</span> to confirm:
                </label>
                <input
                  type="text"
                  value={resetConfirmInput}
                  onChange={(e) => setResetConfirmInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-[#FF5B5B]/40 text-white text-sm font-mono focus:border-[#FF5B5B] focus:outline-none"
                  placeholder="RESET"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetModalOpen(false);
                    setResetConfirmInput('');
                  }}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs text-gray-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetConfirmInput.trim() !== 'RESET'}
                  className="px-4 py-2 rounded-lg bg-[#FF5B5B] hover:bg-[#e04848] text-white text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Erase All Vault Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
