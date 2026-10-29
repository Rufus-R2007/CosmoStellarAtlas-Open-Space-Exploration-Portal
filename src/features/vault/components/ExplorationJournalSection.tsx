import React, { useState } from 'react';
import {
  PenTool,
  Plus,
  Search,
  Trash2,
  Edit2,
  Calendar,
  X,
  Check,
  AlertTriangle,
  Globe,
  Rocket,
  Radio,
  ShieldAlert,
  FileText,
} from 'lucide-react';
import { JournalNote, VaultEntityType } from '../../../types';
import { useVaultStore } from '../../../store/useVaultStore';

export const ExplorationJournalSection: React.FC = () => {
  const journalNotes = useVaultStore((s) => s.journalNotes);
  const createJournalNote = useVaultStore((s) => s.createJournalNote);
  const updateJournalNote = useVaultStore((s) => s.updateJournalNote);
  const deleteJournalNote = useVaultStore((s) => s.deleteJournalNote);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Modal states
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<JournalNote | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formEntityType, setFormEntityType] = useState<VaultEntityType | 'general'>('general');
  const [formEntityTitle, setFormEntityTitle] = useState('');
  const [formTagsString, setFormTagsString] = useState('');

  // Extract all unique tags
  const allTags = Array.from(
    new Set(journalNotes.flatMap((n) => n.tags || []))
  );

  const filteredNotes = journalNotes.filter((note) => {
    if (selectedTag !== 'all' && (!note.tags || !note.tags.includes(selectedTag))) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content.toLowerCase().includes(q);
      const matchEntity = note.entityTitle?.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchEntity) return false;
    }
    return true;
  });

  const handleOpenCreate = () => {
    setFormTitle('');
    setFormContent('');
    setFormEntityType('general');
    setFormEntityTitle('');
    setFormTagsString('');
    setEditingNote(null);
    setIsNoteModalOpen(true);
  };

  const handleOpenEdit = (note: JournalNote) => {
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormEntityType(note.entityType || 'general');
    setFormEntityTitle(note.entityTitle || '');
    setFormTagsString((note.tags || []).join(', '));
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const tags = formTagsString
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    if (editingNote) {
      updateJournalNote(editingNote.id, {
        title: formTitle.trim(),
        content: formContent.trim(),
        entityType: formEntityType,
        entityTitle: formEntityTitle.trim() || undefined,
        tags,
      });
    } else {
      createJournalNote({
        title: formTitle.trim(),
        content: formContent.trim(),
        entityType: formEntityType,
        entityTitle: formEntityTitle.trim() || undefined,
        tags,
      });
    }

    setIsNoteModalOpen(false);
    setEditingNote(null);
  };

  const handleConfirmDelete = () => {
    if (deletingNoteId) {
      deleteJournalNote(deletingNoteId);
      setDeletingNoteId(null);
    }
  };

  const getEntityIcon = (type?: VaultEntityType | 'general') => {
    switch (type) {
      case 'planet':
        return <Globe className="w-3.5 h-3.5 text-[#20D9F2]" />;
      case 'mission':
        return <Rocket className="w-3.5 h-3.5 text-[#8565FA]" />;
      case 'rover':
        return <Radio className="w-3.5 h-3.5 text-[#FFB45B]" />;
      case 'asteroid':
        return <ShieldAlert className="w-3.5 h-3.5 text-[#FF5B5B]" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <PenTool className="w-5 h-5 text-[#FFB45B]" />
            <span>Exploration Journal</span>
            <span className="text-xs font-mono font-normal text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full ml-1">
              {journalNotes.length} Log Entries
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Personal observatory logbook for recording astrophysical notes, hypothesis testing, and mission observations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search journal entries..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#20D9F2]"
            />
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FFB45B] to-[#8565FA] text-black font-semibold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-[#FFB45B]/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Log Entry</span>
          </button>
        </div>
      </div>

      {/* Tag Filtering Bar */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-gray-500 font-mono text-[11px] shrink-0">Tags:</span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors cursor-pointer ${
              selectedTag === 'all'
                ? 'bg-[#20D9F2] text-black font-bold'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            #all
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#20D9F2] text-black font-bold'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="relative rounded-xl border border-white/10 bg-[#0B1528]/80 backdrop-blur-md p-5 flex flex-col justify-between hover:border-white/25 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                      {getEntityIcon(note.entityType)}
                    </div>
                    {note.entityTitle && (
                      <span className="text-xs font-mono text-[#20D9F2] truncate max-w-[150px]">
                        {note.entityTitle}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(note)}
                      title="Edit Log"
                      className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeletingNoteId(note.id)}
                      title="Delete Log"
                      className="p-1 text-gray-400 hover:text-[#FF5B5B] rounded hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-wide mb-2 group-hover:text-[#FFB45B] transition-colors">
                  {note.title}
                </h3>

                <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed line-clamp-4 mb-4">
                  {note.content}
                </p>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {note.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono text-[#8565FA] bg-[#8565FA]/10 border border-[#8565FA]/20 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                {note.updatedAt !== note.createdAt && <span>(edited)</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02]">
          <PenTool className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white mb-1">No Journal Entries Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
            {searchQuery
              ? 'No log entries match your active filters.'
              : 'Record observational insights, rover mission interpretations, and celestial coordinates in your private logbook.'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-medium transition-colors cursor-pointer"
          >
            Create First Log Entry
          </button>
        </div>
      )}

      {/* Create / Edit Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#090F1E] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-[#FFB45B]" />
                <h3 className="text-base font-bold text-white">
                  {editingNote ? 'Edit Research Log' : 'New Exploration Journal Log'}
                </h3>
              </div>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                  Log Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  maxLength={70}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#20D9F2] focus:outline-none"
                  placeholder="e.g. Atmospheric Methane Spike in Gale Crater"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                    Related Module
                  </label>
                  <select
                    value={formEntityType}
                    onChange={(e) =>
                      setFormEntityType(e.target.value as VaultEntityType | 'general')
                    }
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-[#20D9F2] focus:outline-none cursor-pointer"
                  >
                    <option value="general" className="bg-[#090F1E]">General Observation</option>
                    <option value="planet" className="bg-[#090F1E]">Planet / Celestial Body</option>
                    <option value="mission" className="bg-[#090F1E]">Mission / Spaceflight</option>
                    <option value="rover" className="bg-[#090F1E]">Mars Rover / Surface</option>
                    <option value="asteroid" className="bg-[#090F1E]">Asteroid / Planetary Defense</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                    Entity Name / Ref
                  </label>
                  <input
                    type="text"
                    value={formEntityTitle}
                    onChange={(e) => setFormEntityTitle(e.target.value)}
                    maxLength={40}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:border-[#20D9F2] focus:outline-none"
                    placeholder="e.g. Mars, Voyager 1, Bennu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                  Log Entry Body
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#20D9F2] focus:outline-none leading-relaxed"
                  placeholder="Enter scientific observations, hypotheses, or observational notes..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formTagsString}
                  onChange={(e) => setFormTagsString(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono focus:border-[#20D9F2] focus:outline-none"
                  placeholder="e.g. methane, spectroscopy, habitability"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs text-gray-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#FFB45B] to-[#8565FA] text-black text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingNote ? 'Save Updates' : 'Publish Entry'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingNoteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl border border-[#FF5B5B]/30 bg-[#090F1E] p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-[#FF5B5B]">
              <div className="p-2 rounded-lg bg-[#FF5B5B]/10">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Delete Journal Entry?</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              This will permanently delete this research note from your local browser vault.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingNoteId(null)}
                className="px-3.5 py-1.5 rounded-lg border border-white/10 text-xs text-gray-300 hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-lg bg-[#FF5B5B] hover:bg-[#e04848] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Delete Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
