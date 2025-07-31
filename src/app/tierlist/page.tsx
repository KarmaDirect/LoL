'use client';

import { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  useDroppable
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
  arrayMove,
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Users, Save, Download, Trash2, Crown, Star, Heart, Zap, Plus, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface TierItem {
  id: string;
  name: string;
  photoUrl?: string;
  tier: string;
}

interface TierList {
  id: string;
  name: string;
  items: TierItem[];
  createdAt?: string;
}

const defaultTiers = [
  { id: 'S', name: 'S', fullName: 'Légende', bgColor: 'bg-gradient-to-r from-lol-gold to-yellow-400', icon: Crown },
  { id: 'A', name: 'A', fullName: 'Pro', bgColor: 'bg-gradient-to-r from-lol-green to-emerald-400', icon: Star },
  { id: 'B', name: 'B', fullName: 'Solide', bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-400', icon: Heart },
  { id: 'C', name: 'C', fullName: 'Moyen', bgColor: 'bg-gradient-to-r from-orange-500 to-yellow-500', icon: Zap },
  { id: 'D', name: 'D', fullName: 'Débutant', bgColor: 'bg-gradient-to-r from-red-500 to-pink-500', icon: Users },
  { id: 'F', name: 'F', fullName: 'Intouchable', bgColor: 'bg-gradient-to-r from-gray-600 to-gray-400', icon: Users },
];

// Composant pour les éléments draggables
function SortablePlayerCard({ player, onRemove }: { player: TierItem; onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: player.id });



  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      {...attributes}
      {...listeners}
    >
      <div 
        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-lol-purple/50 transition-colors cursor-grab active:cursor-grabbing hover:scale-105"
      >
        <img
          src={player.photoUrl || `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/1.png`}
          alt={player.name}
          className="w-12 h-12 rounded-full border border-lol-purple/50"
          draggable={false}
        />
        <span className="text-sm text-white font-medium truncate flex-1">{player.name}</span>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 hover:bg-red-500/20 rounded transition-colors"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
                 )}
       </div>
     </div>
   );
}

// Composant pour les zones de drop
function TierDropZone({ tier, children }: { 
  tier: typeof defaultTiers[0]; 
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `tier-${tier.id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[80px] p-3 rounded-lg border-2 border-dashed transition-colors ${
        isOver 
          ? 'border-lol-purple/60 bg-lol-purple/10' 
          : 'border-white/20 hover:border-white/40'
      } ${tier.bgColor} bg-opacity-10`}
    >
      {children}
    </div>
  );
}

export default function TierListPage() {
  const { storedSummoners, playerRanks } = useApp();
  const [tierList, setTierList] = useState<TierList>({
    id: 'default-tier-list',
    name: 'Ma Tier List',
    items: []
  });
  const [availablePlayers, setAvailablePlayers] = useState<TierItem[]>([]);
  const [listName, setListName] = useState('Ma Tier List');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<TierItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTierList = localStorage.getItem('currentTierList');
      if (savedTierList) {
        const parsed = JSON.parse(savedTierList);
        setTierList(parsed);
        setListName(parsed.name || 'Ma Tier List');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentTierList', JSON.stringify(tierList));
    }
  }, [tierList]);

  useEffect(() => {
    const players: TierItem[] = storedSummoners.map(summoner => ({
      id: summoner.name, // Utiliser le nom comme ID unique
      name: summoner.name,
      photoUrl: summoner.profileIconUrl,
      tier: ''
    }));

    const usedPlayerIds = new Set(tierList.items.map(item => item.id));
    const available = players.filter(p => !usedPlayerIds.has(p.id));
    setAvailablePlayers(available);
  }, [storedSummoners, playerRanks, tierList.items]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const draggedPlayer = [...availablePlayers, ...tierList.items].find(p => p.id === active.id);
    setDraggedItem(draggedPlayer || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setDraggedItem(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropped on a tier
    if (overId.startsWith('tier-')) {
      const tierId = overId.replace('tier-', '');
      addPlayerToTier(activeId, tierId);
      return;
    }

    // Reordering within the same tier
    const activePlayer = tierList.items.find(p => p.id === activeId);
    const overPlayer = tierList.items.find(p => p.id === overId);
    
    if (activePlayer && overPlayer && activePlayer.tier === overPlayer.tier) {
      const oldIndex = tierList.items.findIndex(p => p.id === activeId);
      const newIndex = tierList.items.findIndex(p => p.id === overId);
      
      const newItems = arrayMove(tierList.items, oldIndex, newIndex);
      setTierList(prev => ({ ...prev, items: newItems }));
    }
  };

  const addPlayerToTier = (playerId: string, tier: string) => {
    const player = availablePlayers.find(p => p.id === playerId) || 
                  tierList.items.find(p => p.id === playerId);
    
    if (!player) return;

    // Remove from current tier if exists
    const updatedItems = tierList.items.filter(p => p.id !== playerId);
    
    // Add to new tier
    const updatedPlayer = { ...player, tier };
    setTierList(prev => ({
      ...prev,
      items: [...updatedItems, updatedPlayer]
    }));
  };

  const removePlayerFromTier = (playerId: string) => {
    setTierList(prev => ({
      ...prev,
      items: prev.items.filter(p => p.id !== playerId)
    }));
  };

  const saveTierList = () => {
    const tierListToSave = {
      ...tierList,
      name: listName,
      createdAt: new Date().toISOString()
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentTierList', JSON.stringify(tierListToSave));
    }
    setTierList(tierListToSave);
  };

  const exportTierList = () => {
    const dataStr = JSON.stringify(tierList, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `tierlist-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const resetTierList = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser la tier list ?')) {
             setTierList({
         id: 'default-tier-list',
         name: 'Ma Tier List',
         items: []
       });
      setListName('Ma Tier List');
    }
  };



  return (
    <div className="min-h-screen bg-lol-dark">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="glass-card p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Tier List Entre Potes</h1>
              <p className="text-gray-400">Classez vos joueurs par niveau de skill</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                placeholder="Nom de la tier list"
              />
              <button
                onClick={saveTierList}
                className="lol-button text-sm hover:scale-105 active:scale-95 transition-transform"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder</span>
              </button>
              <button
                onClick={exportTierList}
                className="lol-button-secondary text-sm hover:scale-105 active:scale-95 transition-transform"
              >
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </button>
              <button
                onClick={resetTierList}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Available Players */}
            {availablePlayers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Joueurs disponibles ({availablePlayers.length})
                </h3>
                <SortableContext items={availablePlayers.map(p => p.id)} strategy={verticalListSortingStrategy}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                         {availablePlayers.map((player) => (
                       <SortablePlayerCard
                         key={`available-${player.id}`}
                         player={player}
                         onRemove={() => {}}
                       />
                     ))}
                  </div>
                </SortableContext>
              </div>
            )}

            {/* Tier List */}
            <div className="space-y-4">
              {defaultTiers.map((tier) => {
                const tierPlayers = tierList.items.filter(item => item.tier === tier.id);
                
                return (
                  <div key={tier.id} className="glass-card p-4">
                    <div className={`flex items-center gap-3 mb-3 p-2 rounded-lg ${tier.bgColor}`}>
                      <tier.icon className="w-4 h-4" />
                      <h3 className="text-sm font-bold text-white">{tier.name} - {tier.fullName}</h3>
                      <span className="text-xs text-white/80">({tierPlayers.length})</span>
                    </div>
                    
                    <TierDropZone tier={tier}>
                      {tierPlayers.length > 0 ? (
                        <SortableContext items={tierPlayers.map(p => p.id)} strategy={verticalListSortingStrategy}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                                       {tierPlayers.map((player) => (
                             <SortablePlayerCard
                               key={`tier-${tier.id}-${player.id}`}
                               player={player}
                               onRemove={() => removePlayerFromTier(player.id)}
                             />
                           ))}
                          </div>
                        </SortableContext>
                      ) : (
                        <div className="text-center py-4 text-gray-400">
                          <Users className="w-6 h-6 mx-auto mb-1 opacity-50" />
                          <p className="text-xs">Glissez un joueur ici</p>
                        </div>
                      )}
                    </TierDropZone>
                  </div>
                );
              })}
            </div>

            {/* Drag Overlay */}
            <DragOverlay dropAnimation={null}>
              {draggedItem ? (
                <div className="bg-white/10 backdrop-blur-sm border border-lol-purple/50 rounded-lg p-3 shadow-lg pointer-events-none">
                  <div className="flex items-center gap-3">
                    <img
                      src={draggedItem.photoUrl || `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/1.png`}
                      alt={draggedItem.name}
                      className="w-12 h-12 rounded-full border border-lol-purple/50"
                    />
                    <span className="text-sm text-white font-medium">{draggedItem.name}</span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* Empty State */}
          {availablePlayers.length === 0 && tierList.items.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400 opacity-50" />
              <h3 className="text-lg font-bold text-white mb-2">Aucun joueur disponible</h3>
              <p className="text-gray-400 text-sm">
                Ajoutez des joueurs depuis la page d'accueil pour commencer votre tier list.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 