import { useState } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { UseOrganigramDragResult } from '../types/organigram';
import { usePositions } from './usePositions';

export const useOrganigramDrag = (): UseOrganigramDragResult => {
  const [isDragging, setIsDragging] = useState(false);
  const { updatePosition } = usePositions();

  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
    
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const sourceId = source.droppableId;
    const destinationId = destination.droppableId;

    const [, sourceTierId, , sourceSlotIndex] = sourceId.split('-');
    const [, destTierId, , destSlotIndex] = destinationId.split('-');

    if (
      sourceTierId === destTierId &&
      sourceSlotIndex === destSlotIndex &&
      destination.index === source.index
    ) {
      return;
    }

    updatePosition.mutate({
      id: draggableId,
      tier: parseInt(destTierId),
      x: parseInt(destSlotIndex),
    });
  };

  return {
    isDragging,
    onDragStart,
    onDragEnd,
  };
};