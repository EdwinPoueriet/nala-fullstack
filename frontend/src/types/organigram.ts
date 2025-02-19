import { DropResult } from "@hello-pangea/dnd";

export interface Position {
  id: string;
  title: string;
  division?: string;
  tier: number;
  x: number;
  y: number;
}

export interface Employee {
  id: string;
  name: string;
  position: string | null;
  email: string;
}

export interface Division {
  id: string;
  name: string;
}

export interface Tier {
  id: number;
  name: string;
  order: number;
  slots: number;
  positions: Position[];
}

//to do, move these props interfaces somewhere else

export interface PositionCardProps {
  isNew?: boolean;
  position?: Position;
  index?: number;
  divisions?: Division[];
  isLoading?: boolean;
  onAdd?: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, newTitle: string) => void;
  onChangeDivision?: (id: string, divisionId: string) => void;
}

export interface TierColumnProps {
  tier: number;
  name: string;
  positions: Position[];
  slots: number;
  onRename: (tierId: number, newName: string) => void;
  onDeleteTier: () => void;
  isLastTier?: boolean;
  onAddTierBelow?: () => void;
  children:
    | React.ReactElement<PositionCardProps>
    | React.ReactElement<PositionCardProps>[];
}

export interface SlotColumnProps {
  tierId: number;
  slotIndex: number;
  position?: Position;
  children?: React.ReactNode;
}

export interface TierHeaderProps {
  name: string;
  tierId: number;
  onRename: (tierId: number, newName: string) => void;
  onDelete: () => void;
}

export interface SlotColumnProps {
  tierId: number;
  slotIndex: number;
  position?: Position;
  children?: React.ReactNode;
}

export interface PositionCardContentProps {
  position: Position;
  isEditing: boolean;
  editedTitle: string;
  isLoading: boolean;
  divisions: Division[];
  selectedDivision: string;
  assignedEmployees: any[];  
  onEdit: () => void;
  onDelete: () => void;
  onTitleChange: (value: string) => void;
  onTitleSave: () => void;
  onDivisionChange: (event: any) => void;
  onAddPosition: () => void;
  onEmployeeManage: () => void;
  isEmployeeDialogOpen: boolean;
  onEmployeeDialogClose: () => void;
}

export interface OrganigramProps {
  defaultScale?: number;
  minScale?: number;
  maxScale?: number;
}

export interface UseOrganigramResult {
  isLoading: boolean;
  error: Error | null;
  positions: Position[];
  divisions: Division[];
  tiers: Tier[];
  organizedTiers: Tier[];
  totalSlots: number;
  handleAddPosition: (tierId: number) => Promise<void>;
  handleEditPosition: (positionId: string, newTitle: string, x: number) => Promise<void>;
  handleDeletePosition: (positionId: string) => Promise<void>;
  handleRenameTier: (tierId: number, newName: string) => void;
  handleDeleteTier: (tierId: number) => void;
  handleCreateTier: () => void;
}

export interface UseOrganigramDragResult {
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: (result: DropResult) => void;
}

export interface DragHandlers {
  onDragStart: () => void;
  onDragEnd: (result: DropResult) => void;
}

export const MIN_SLOTS = 4;