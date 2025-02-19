import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Position, SlotColumnProps } from '../../types/organigram';


const SlotColumn: React.FC<SlotColumnProps> = ({
  tierId,
  slotIndex,
  children,
}) => {
  return (
    <Droppable
      droppableId={`tier-${tierId}-slot-${slotIndex}`}
      direction="vertical"
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`
            min-h-[100px] 
            flex items-start justify-center
            transition-colors duration-200
            ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}
          `}
        >
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default SlotColumn;