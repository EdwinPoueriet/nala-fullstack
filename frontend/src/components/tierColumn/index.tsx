import React, { ReactElement } from 'react';
import { Position, PositionCardProps } from '../../types/organigram';
import Plus from '@mui/icons-material/Add'; 
import SlotColumn from './SlotColumn';
import TierHeader from './TierHeader';

interface TierColumnProps {
  tier: number;
  name: string;
  positions: Position[];
  children: ReactElement<PositionCardProps> | ReactElement<PositionCardProps>[];
  onRename: (tierId: number, newName: string) => void;
  onDeleteTier: () => void;
  isLastTier?: boolean;
  onAddTierBelow?: () => void;
  slots?: number;
}

const TierColumn: React.FC<TierColumnProps> = ({
  tier,
  name,
  positions,
  children,
  onRename,
  onDeleteTier,
  isLastTier,
  onAddTierBelow,
  slots = 5,
}) => {
  const isEvenTier = tier % 2 === 0;

  const slotPositions = Array.from({ length: slots }).map((_, index) => {
    return positions.find(p => p.x === index);
  });

  return (
    <div className={`relative border-b border-gray-200 min-h-[200px] ${
      isEvenTier ? 'bg-gray-100' : 'bg-gray-50'
    }`}>
      <TierHeader
        name={name}
        tierId={tier}
        onRename={onRename}
        onDelete={onDeleteTier}
      />
     
      <div className="pl-16 pt-8 pb-12 min-h-[200px] grid gap-8"
        style={{
          gridTemplateColumns: `repeat(${slots}, minmax(256px, 1fr))`
        }}
      >
        {slotPositions.map((position, index) => (
          <SlotColumn
            key={`slot-${index}`}
            tierId={tier}
            slotIndex={index}
            position={position}
          >
            {position && React.Children.map(children, (child: ReactElement<PositionCardProps>) => {
              if (child.props.position?.id === position.id) {
                return child;
              }
              return null;
            })}
          </SlotColumn>
        ))}
      </div>

      {isLastTier && onAddTierBelow && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
          <button
            onClick={onAddTierBelow}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shadow-sm transition-colors"
          >
            <Plus className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TierColumn;