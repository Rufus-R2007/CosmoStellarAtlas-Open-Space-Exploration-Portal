import React, { useState } from 'react';
import {
  Folder,
  FolderPlus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';
import { CollectionItem } from '../../../types';
import { useVaultStore } from '../../../store/useVaultStore';

const COLOR_OPTIONS = [
  '#20D9F2', // Cyan
  '#8565FA', // Violet
  '#FFB45B', // Gold
  '#FF5B5B', // Red
  '#4EFA9D', // Emerald
  '#FA6CE8', // Pink
];

export const CollectionsSection: React.FC = () => {
  const collections = useVaultStore((s) => s.collections);
  const favorites = useVaultStore((s) => s.favorites);
  const createCollection = useVaultStore((s) => s.createCollection);
  const updateCollection = useVaultStore((s) => s.updateCollection);
  const deleteCollection = useVaultStore((s) => s.deleteCollection);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionItem | null>(null);
  const [deletingCollectionId, setDeletingCollectionId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formColor, setFormColor] = useState(COLOR_OPTIONS[0]);

  const handleOpenCreate = () => {
    setFormName('');
    setFormDesc('');
    setFormColor(COLOR_OPTIONS[0]);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (col: CollectionItem) => {
    setFormName(col.name);
    setFormDesc(col.description);
    setFormColor(col.colorHex || COLOR_OPTIONS[0]);
    setEditingCollection(col);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    createCollection(formName.trim(), formDesc.trim(), formColor);
    setIsCreateModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCollection || !formName.trim()) return;
    updateCollection(editingCollection.id, formName.trim(), formDesc.trim(), formColor);
    setEditingCollection(null);
  };

  const handleConfirmDelete = () => {
    if (deletingCollectionId) {
      deleteCollection(deletingCollectionId);
      setDeletingCollectionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Folder className="w-5 h-5 text-[#8565FA]" />
            <span>Personal Collections</span>
            <span className="text-xs font-mono font-normal text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full ml-1">
              {collections.length} Shelves
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Group related planets, rover shots, milestones, and impact targets into custom research dossiers.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8565FA] to-[#20D9F2] text-white font-medium text-xs hover:opacity-90 transition-all cursor-pointer shadow-md shadow-[#8565FA]/20 w-fit"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Collections Grid */}
      {collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => {
            const count = favorites.filter((f) => f.collectionIds.includes(col.id)).length;
            return (
              <div
                key={col.id}
                className="relative rounded-xl border border-white/10 bg-[#0B1528]/80 backdrop-blur-md p-5 flex flex-col justify-between hover:border-white/20 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="p-2 rounded-lg border flex items-center justify-center"
                        style={{
                          borderColor: `${col.colorHex}40`,
                          backgroundColor: `${col.colorHex}15`,
                          color: col.colorHex,
                        }}
                      >
                        <FolderOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white tracking-wide group-hover:text-[#20D9F2] transition-colors">
                          {col.name}
                        </h3>
                        <span className="text-[11px] font-mono text-gray-400">
                          {count} {count === 1 ? 'item' : 'items'} enclosed
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEdit(col)}
                        title="Edit Collection"
                        className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingCollectionId(col.id)}
                        title="Delete Collection"
                        className="p-1.5 text-gray-400 hover:text-[#FF5B5B] rounded hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed mb-4">
                    {col.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
                  <span>Created: {new Date(col.createdAt).toLocaleDateString()}</span>
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: col.colorHex }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02]">
          <Folder className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-white mb-1">No Custom Collections</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
            Create custom collection shelves to categorize your space discoveries.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-medium transition-colors cursor-pointer"
          >
            Create First Collection
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(isCreateModalOpen || editingCollection) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#090F1E] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#8565FA]" />
                <h3 className="text-base font-bold text-white">
                  {isCreateModalOpen ? 'Create New Collection' : 'Edit Collection'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingCollection(null);
                }}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={isCreateModalOpen ? handleSaveCreate : handleSaveEdit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  maxLength={40}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#20D9F2] focus:outline-none"
                  placeholder="e.g. Outer Solar System Voyagers"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  maxLength={180}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:border-[#20D9F2] focus:outline-none"
                  placeholder="Brief description of this collection's theme..."
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                        formColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {formColor === c && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingCollection(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-white/10 text-xs text-gray-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#8565FA] to-[#20D9F2] text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isCreateModalOpen ? 'Create Shelf' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCollectionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl border border-[#FF5B5B]/30 bg-[#090F1E] p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-[#FF5B5B]">
              <div className="p-2 rounded-lg bg-[#FF5B5B]/10">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Delete Collection?</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Are you sure you want to remove this collection?
              <span className="text-[#20D9F2] block mt-1">
                Your bookmarked favorites will remain completely safe in your Space Vault—only their assignment to this shelf will be removed.
              </span>
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingCollectionId(null)}
                className="px-3.5 py-1.5 rounded-lg border border-white/10 text-xs text-gray-300 hover:bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-lg bg-[#FF5B5B] hover:bg-[#e04848] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Delete Shelf
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

