import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Search,
  ExternalLink,
  Trash2,
  FolderPlus,
  Folder,
  Globe,
  Rocket,
  Radio,
  Image as ImageIcon,
  ShieldAlert,
  X,
  Plus,
} from 'lucide-react';
import { VaultEntityType } from '../../../types';
import { useVaultStore } from '../../../store/useVaultStore';
import { Badge } from '../../../components/common/Badge';

export const UniversalFavoritesSection: React.FC = () => {
  const navigate = useNavigate();
  const favorites = useVaultStore((s) => s.favorites);
  const collections = useVaultStore((s) => s.collections);
  const removeFavorite = useVaultStore((s) => s.removeFavorite);
  const addFavoriteToCollection = useVaultStore((s) => s.addFavoriteToCollection);
  const removeFavoriteFromCollection = useVaultStore((s) => s.removeFavoriteFromCollection);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [assigningFavId, setAssigningFavId] = useState<string | null>(null);

  const categories: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Favorites', icon: <Star className="w-3.5 h-3.5" /> },
    { id: 'planet', label: 'Planets', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'mission', label: 'Missions', icon: <Rocket className="w-3.5 h-3.5" /> },
    { id: 'rover', label: 'Rovers', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'image', label: 'Photos', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: 'asteroid', label: 'Asteroids', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
  ];

  // Filtering
  const filteredFavorites = favorites.filter((fav) => {
    // Category filter
    if (activeCategory !== 'all' && fav.entityType !== activeCategory) {
      return false;
    }
    // Collection filter
    if (selectedCollectionId !== 'all' && !fav.collectionIds.includes(selectedCollectionId)) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = fav.title.toLowerCase().includes(q);
      const matchSub = fav.subtitle.toLowerCase().includes(q);
      if (!matchTitle && !matchSub) return false;
    }
    return true;
  });

  const getEntityIcon = (type: VaultEntityType) => {
    switch (type) {
      case 'planet':
        return <Globe className="w-4 h-4 text-[#20D9F2]" />;
      case 'mission':
        return <Rocket className="w-4 h-4 text-[#8565FA]" />;
      case 'rover':
        return <Radio className="w-4 h-4 text-[#FFB45B]" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-[#20D9F2]" />;
      case 'asteroid':
        return <ShieldAlert className="w-4 h-4 text-[#FF5B5B]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Star className="w-5 h-5 text-[#FFB45B]" />
            <span>Universal Bookmarks</span>
            <span className="text-xs font-mono font-normal text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full ml-1">
              {favorites.length} Saved
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Curated celestial discoveries, spacecraft dossiers, rover observations, and hazardous asteroids.
          </p>
        </div>

        {/* Search & Collection Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved discoveries..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#20D9F2]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-300">
            <Folder className="w-3.5 h-3.5 text-[#8565FA]" />
            <select
              value={selectedCollectionId}
              onChange={(e) => setSelectedCollectionId(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#090F1E] text-white">
                All Collections
              </option>
              {collections.map((col) => (
                <option key={col.id} value={col.id} className="bg-[#090F1E] text-white">
                  {col.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count =
            cat.id === 'all'
              ? favorites.length
              : favorites.filter((f) => f.entityType === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-[#20D9F2] text-black font-bold' : 'bg-white/10 text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Card Grid */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFavorites.map((fav) => {
            const assignedCollections = collections.filter((c) =>
              fav.collectionIds.includes(c.id)
            );

            return (
              <div
                key={fav.id}
                className="relative rounded-xl border border-white/10 bg-[#0B1528]/80 backdrop-blur-md p-4 flex flex-col justify-between hover:border-white/25 transition-all group"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                        {getEntityIcon(fav.entityType)}
                      </div>
                      <Badge variant="cyan" className="font-mono text-[10px] uppercase">
                        {fav.categoryBadge}
                      </Badge>
                      {fav.isSynthetic && (
                        <Badge variant="violet" className="font-mono text-[9px] uppercase">
                          SYNTHETIC
                        </Badge>
                      )}
                    </div>

                    <button
                      onClick={() => removeFavorite(fav.id)}
                      title="Remove from favorites"
                      className="text-gray-400 hover:text-[#FF5B5B] p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-base font-bold text-white tracking-wide mb-1 group-hover:text-[#20D9F2] transition-colors">
                    {fav.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">{fav.subtitle}</p>

                  {/* Assigned Collections tags */}
                  {assignedCollections.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {assignedCollections.map((col) => (
                        <span
                          key={col.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border"
                          style={{
                            borderColor: `${col.colorHex}40`,
                            backgroundColor: `${col.colorHex}15`,
                            color: col.colorHex,
                          }}
                        >
                          <Folder className="w-2.5 h-2.5" />
                          <span>{col.name}</span>
                          <button
                            onClick={() => removeFavoriteFromCollection(fav.id, col.id)}
                            className="hover:opacity-75 cursor-pointer ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10 text-xs">
                  {/* Add to collection button */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setAssigningFavId(assigningFavId === fav.id ? null : fav.id)
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <FolderPlus className="w-3 h-3 text-[#8565FA]" />
                      <span>Collections</span>
                    </button>

                    {/* Collection Popover */}
                    {assigningFavId === fav.id && (
                      <div className="absolute left-0 bottom-full mb-2 w-52 p-2 rounded-xl bg-[#0B1528] border border-white/20 shadow-xl z-30 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-gray-400 block px-2 py-1">
                          Assign to Collection:
                        </span>
                        {collections.length === 0 && (
                          <div className="text-xs text-gray-500 px-2 py-1">
                            No collections created yet.
                          </div>
                        )}
                        {collections.map((col) => {
                          const isIn = fav.collectionIds.includes(col.id);
                          return (
                            <button
                              key={col.id}
                              onClick={() => {
                                if (isIn) {
                                  removeFavoriteFromCollection(fav.id, col.id);
                                } else {
                                  addFavoriteToCollection(fav.id, col.id);
                                }
                              }}
                              className="w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: col.colorHex }}
                                />
                                <span>{col.name}</span>
                              </div>
                              {isIn ? (
                                <span className="text-[#20D9F2] text-[10px] font-mono">Added</span>
                              ) : (
                                <Plus className="w-3 h-3 text-gray-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Navigate to original route */}
                  <button
                    onClick={() => navigate(fav.route)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#20D9F2] hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Open in Module</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.02]">
          <Star className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white mb-1">No Bookmarked Discoveries Found</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto mb-5">
            {searchQuery
              ? 'No favorites match your active search and category filters.'
              : 'Save planets, historical missions, Mars rover images, or hazardous asteroids across the portal using their star bookmark buttons.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => navigate('/planets')}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Explore Planets
            </button>
            <button
              onClick={() => navigate('/missions')}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Inspect Missions
            </button>
            <button
              onClick={() => navigate('/rovers')}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Browse Rover Photos
            </button>
            <button
              onClick={() => navigate('/asteroids')}
              className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Track Asteroids
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
