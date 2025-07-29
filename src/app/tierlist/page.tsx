'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { 
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Users, Save, Download, Trash2, Crown, Star, Heart, Zap, GripVertical } from 'lucide-react';
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
}

const defaultTiers = [
  { id: 'S', name: 'S - Légende', color: 'from-lol-gold to-yellow-400', icon: Crown },
  { id: 'A', name: 'A - Pro', color: 'from-lol-green to-emerald-400', icon: Star },
  { id: 'B', name: 'B - Solide', color: 'from-blue-500 to-cyan-400', icon: Heart },
  { id: 'C', name: 'C - Moyen', color: 'from-orange-500 to-yellow-500', icon: Zap },
  { id: 'D', name: 'D - Débutant', color: 'from-red-500 to-pink-500', icon: Users },
  { id: 'F', name: 'F - Intouchable', color: 'from-gray-600 to-gray-400', icon: Users },
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
    <motion.div
      ref={setNodeRef}
      style={style}
      whileHover={{ scale: 1.05 }}
      className={`tier-list-item relative ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </button>
        <img
          src={player.photoUrl || `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/1.png`}
          alt={player.name}
          className="w-12 h-12 rounded-full border-2 border-lol-purple/50"
        />
        <span className="text-sm text-white font-medium">{player.name}</span>
      </div>
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-lol-red text-white rounded-full p-1 hover:bg-lol-red/80 transition-colors"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

export default function TierListPage() {
  const { storedSummoners, playerRanks } = useApp();
  const [tierList, setTierList] = useState<TierList>({
    id: 'default',
    name: 'Tier List Entre Potes',
    items: []
  });
  const [availablePlayers, setAvailablePlayers] = useState<TierItem[]>([]);
  const [selectedTier, setSelectedTier] = useState('S');
  const [listName, setListName] = useState('Tier List Entre Potes');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<TierItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    // Créer la liste des joueurs disponibles
    const players = storedSummoners.map(summoner => ({
      id: summoner.name,
      name: summoner.name,
      photoUrl: playerRanks[summoner.name]?.profileIconId 
        ? `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${playerRanks[summoner.name].profileIconId}.png`
        : undefined,
      tier: ''
    }));
    setAvailablePlayers(players);
  }, [storedSummoners, playerRanks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Trouver l'élément dragué
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

    // Si on dépose sur une tier
    if (defaultTiers.some(tier => tier.id === overId)) {
      const player = availablePlayers.find(p => p.id === activeId) || 
                    tierList.items.find(p => p.id === activeId);
      
      if (player) {
        addPlayerToTier(player.id, overId);
      }
      return;
    }

    // Si on dépose sur un autre joueur, on réorganise dans la même tier
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

    // Retirer le joueur de la liste disponible
    setAvailablePlayers(prev => prev.filter(p => p.id !== playerId));
    
    // Retirer le joueur de sa tier actuelle s'il y est déjà
    setTierList(prev => ({
      ...prev,
      items: prev.items.filter(p => p.id !== playerId)
    }));
    
    // Ajouter le joueur à la nouvelle tier
    const newPlayer = { ...player, tier };
    setTierList(prev => ({
      ...prev,
      items: [...prev.items, newPlayer]
    }));
  };

  const removePlayerFromTier = (playerId: string) => {
    const player = tierList.items.find(p => p.id === playerId);
    if (!player) return;

    // Retirer le joueur de la tier list
    setTierList(prev => ({
      ...prev,
      items: prev.items.filter(p => p.id !== playerId)
    }));

    // Remettre le joueur dans la liste disponible
    const playerWithoutTier = { ...player, tier: '' };
    setAvailablePlayers(prev => [...prev, playerWithoutTier]);
  };

  const saveTierList = () => {
    const tierListData = {
      ...tierList,
      name: listName,
      createdAt: new Date().toISOString()
    };
    
    const savedLists = JSON.parse(localStorage.getItem('tierLists') || '[]');
    const updatedLists = savedLists.filter((list: any) => list.id !== tierList.id);
    updatedLists.push(tierListData);
    
    localStorage.setItem('tierLists', JSON.stringify(updatedLists));
    alert('Tier list sauvegardée !');
  };

  const exportTierList = () => {
    const dataStr = JSON.stringify(tierList, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${listName.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-lol-dark">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Users className="w-16 h-16 mx-auto mb-4 text-lol-purple" />
            <h1 className="text-3xl font-bold text-gradient mb-2">Tier List Entre Potes</h1>
            <p className="text-gray-400">Glissez-déposez pour classer vos amis</p>
          </div>

          {/* Controls */}
          <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="Nom de la tier list"
              />
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
              >
                {defaultTiers.map(tier => (
                  <option key={tier.id} value={tier.id}>{tier.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveTierList}
                className="lol-button-secondary"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportTierList}
                className="lol-button-secondary"
              >
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </motion.button>
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
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Joueurs disponibles</h3>
                <SortableContext items={availablePlayers.map(p => p.id)} strategy={verticalListSortingStrategy}>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {availablePlayers.map((player) => (
                      <SortablePlayerCard
                        key={player.id}
                        player={player}
                        onRemove={() => {}} // Pas de suppression pour les joueurs disponibles
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            )}

            {/* Tier List */}
            <div className="space-y-6">
              {defaultTiers.map((tier) => {
                const tierPlayers = tierList.items.filter(item => item.tier === tier.id);
                
                return (
                  <div key={tier.id} className="glass-card p-4">
                    <div 
                      className={`flex items-center gap-3 mb-4 p-3 rounded-lg bg-gradient-to-r ${tier.color} cursor-pointer`}
                      onClick={() => addPlayerToTier(selectedTier, tier.id)}
                    >
                      <tier.icon className="w-5 h-5" />
                      <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                      <span className="text-sm text-white/80">({tierPlayers.length})</span>
                    </div>
                    
                    {tierPlayers.length > 0 ? (
                      <SortableContext items={tierPlayers.map(p => p.id)} strategy={verticalListSortingStrategy}>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {tierPlayers.map((player) => (
                            <SortablePlayerCard
                              key={player.id}
                              player={player}
                              onRemove={() => removePlayerFromTier(player.id)}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucun joueur dans cette tier</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
              {draggedItem ? (
                <div className="tier-list-item opacity-80">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                    <img
                      src={draggedItem.photoUrl || `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/1.png`}
                      alt={draggedItem.name}
                      className="w-12 h-12 rounded-full border-2 border-lol-purple/50"
                    />
                    <span className="text-sm text-white font-medium">{draggedItem.name}</span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {/* Empty State */}
          {availablePlayers.length === 0 && tierList.items.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 mx-auto mb-6 text-gray-400 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-4">Aucun joueur disponible</h3>
              <p className="text-gray-400 mb-6">
                Ajoutez des joueurs depuis la page d'accueil pour commencer votre tier list.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 