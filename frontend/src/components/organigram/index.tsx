import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { DragDropContext } from '@hello-pangea/dnd';
import { OrganigramProps } from '../../types/organigram';
import { useOrganigram } from '../../hooks/useOrganigram';
import { useOrganigramDrag } from '../../hooks/useOrganigramDrag';
import ZoomControls from '../ZoomControls';
import TierColumn from '../tierColumn';
import PositionCard from '../positionCard';

export const Organigram: React.FC<OrganigramProps> = ({
  defaultScale = 1,
  minScale = 0.5,
  maxScale = 2,
}) => {

  const {
    isLoading,
    error,
    divisions,
    organizedTiers,
    totalSlots,
    handleAddPosition,
    handleEditPosition,
    handleDeletePosition,
    handleRenameTier,
    handleDeleteTier,
    handleCreateTier,
  } = useOrganigram();

  const {
    isDragging,
    onDragStart,
    onDragEnd,
  } = useOrganigramDrag();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-4">
        <div className="text-red-500">
          {error.message}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-screen bg-gray-50 overflow-hidden">
      <TransformWrapper
        initialScale={defaultScale}
        minScale={minScale}
        maxScale={maxScale}
        disabled={isDragging}
        limitToBounds={false}
        centerOnInit={true}
      >
        {({ zoomIn, zoomOut }) => (
          <>
            <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} />
            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="!w-full !h-full"
            >
              <DragDropContext 
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              >
                <div className="min-w-[1200px] bg-white shadow-lg"
                  // onMouseDown={() => setIsDragging(true)}
                  // onMouseUp={() => setIsDragging(false)}
                  // onMouseLeave={() => setIsDragging(false)}
                >
                  {organizedTiers.map((tier, index) => (
                    <TierColumn
                      key={tier.id}
                      tier={tier.id}
                      name={tier.name}
                      positions={tier.positions}
                      slots={totalSlots}
                      onRename={handleRenameTier}
                      onDeleteTier={() => handleDeleteTier(tier.id)}
                      isLastTier={index === organizedTiers.length - 1}
                      onAddTierBelow={handleCreateTier}
                    >
                      {tier.positions.map((position, index) => (
                        <PositionCard
                          key={position.id}
                          position={position}
                          index={index}
                          divisions={divisions}
                          onEdit={handleEditPosition}
                          onDelete={handleDeletePosition}
                          onAdd={() => handleAddPosition(tier.id)}
                        />
                      ))}
                    </TierColumn>
                  ))}
                </div>
              </DragDropContext>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default Organigram;