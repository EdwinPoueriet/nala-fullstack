import { useMemo } from 'react';
import { MIN_SLOTS, Position, UseOrganigramResult } from '../types/organigram';
import { usePositions } from './usePositions';
import { useDivisions } from './useDivisions';
import { useTiers } from './useTiers';

export const useOrganigram = (): UseOrganigramResult => {
  const {
    positions,
    isLoading: positionsLoading,
    error: positionsError,
    createPosition,
    updatePosition,
    deletePosition,
  } = usePositions();

  const {
    divisions,
    isLoading: divisionsLoading,
    error: divisionsError,
  } = useDivisions();

  const {
    tiers,
    isLoading: tiersLoading,
    error: tiersError,
    createTier,
    updateTier,
    deleteTier,
  } = useTiers();

  const totalSlots = useMemo(() => {
    if (!positions || !tiers?.length) return MIN_SLOTS;

    const maxPositionsInTier = Math.max(
      ...tiers.map(tier => {
        const tierPositions = positions.filter(p => p.tier === tier.id);
        return Math.max(...tierPositions.map(p => p.x + 1), MIN_SLOTS);
      })
    );

    return Math.max(maxPositionsInTier, MIN_SLOTS);
  }, [positions, tiers]);

  const organizedTiers = useMemo(() => {
    if (!positions || !tiers?.length) return [];

    return tiers.map(tier => ({
      ...tier,
      positions: positions
        .filter(pos => pos.tier === tier.id)
        .sort((a, b) => (a.x || 0) - (b.x || 0))
    }));
  }, [positions, tiers]);

  const handleAddPosition = async (tierId: number) => {
    const tierPositions = positions.filter(p => p.tier === tierId);
    const usedSlots = tierPositions.map(p => p.x);
    let newSlotIndex = 0;
    while (usedSlots.includes(newSlotIndex)) {
      newSlotIndex++;
    }

    createPosition.mutate({
      title: 'New Position',
      tier: tierId,
      x: newSlotIndex,
      y: 0,
      division: '',
    });
  };

  const handleEditPosition = async (positionId: string, newTitle: string, x: number) => {
    updatePosition.mutate({
      id: positionId,
      title: newTitle,
      x: x,
    });
  };

  const handleDeletePosition = async (positionId: string) => {
    deletePosition.mutate(positionId);
  };

  const handleRenameTier = (tierId: number, newName: string) => {
    updateTier.mutate({ id: tierId, name: newName });
  };

  const handleDeleteTier = (tierId: number) => {
    deleteTier.mutate(tierId);
  };

  const handleCreateTier = () => {
    createTier.mutate({
      name: `TIER ${tiers.length + 1}`,
      order: tiers.length + 1,
      slots: totalSlots,
      positions: [] as Position[]
    });
  };

  return {
    isLoading: positionsLoading || divisionsLoading || tiersLoading,
    error: positionsError || divisionsError || tiersError,
    positions,
    divisions,
    tiers,
    organizedTiers,
    totalSlots,
    handleAddPosition,
    handleEditPosition,
    handleDeletePosition,
    handleRenameTier,
    handleDeleteTier,
    handleCreateTier,
  };
};
