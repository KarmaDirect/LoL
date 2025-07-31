'use client';

import { useState } from 'react';
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

const items = [
  { id: '1', name: 'Item 1' },
  { id: '2', name: 'Item 2' },
  { id: '3', name: 'Item 3' },
];

function SortableItem({ item }: { item: { id: string; name: string } }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div 
        {...attributes}
        {...listeners}
        className={`p-4 bg-blue-500 text-white rounded cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
      >
        {item.name}
      </div>
    </div>
  );
}

export default function TestPage() {
  const [itemsList, setItemsList] = useState(items);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<{ id: string; name: string } | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag start:', event);
    const { active } = event;
    setActiveId(active.id as string);
    
    const draggedItem = itemsList.find(item => item.id === active.id);
    setDraggedItem(draggedItem || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('Drag end:', event);
    const { active, over } = event;
    setActiveId(null);
    setDraggedItem(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId !== overId) {
      const oldIndex = itemsList.findIndex(item => item.id === activeId);
      const newIndex = itemsList.findIndex(item => item.id === overId);
      
      const newItems = arrayMove(itemsList, oldIndex, newIndex);
      setItemsList(newItems);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Test Drag and Drop</h1>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemsList.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {itemsList.map((item) => (
              <SortableItem key={item.id} item={item} />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {draggedItem ? (
            <div className="p-4 bg-red-500 text-white rounded">
              {draggedItem.name}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
} 