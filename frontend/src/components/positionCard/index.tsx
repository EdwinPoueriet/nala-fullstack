import { useEffect, useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Position, Division } from "../../types/organigram";
import { Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { usePositions } from "../../hooks/usePositions";
import { useEmployees } from "../../hooks/useEmployees";
import PositionCardContent from "./PositionCardContent";

interface PositionCardProps {
  isNew?: boolean;
  position?: Position;
  index?: number;
  divisions?: Division[];
  isLoading?: boolean;
  onAdd?: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, newTitle: string, index: number) => void;
  onChangeDivision?: (id: string, divisionId: string) => void;
}

const PositionCard: React.FC<PositionCardProps> = ({
  isNew = false,
  position,
  index = 0,
  divisions = [],
  isLoading = false,
  onAdd,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(position?.title || "");
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(
    position?.division || ""
  );

  const { getPositionEmployees } = useEmployees();
  const assignedEmployees = position ? getPositionEmployees(position.id) : [];
  const { updatePosition } = usePositions();

  useEffect(() => {
    setSelectedDivision(position?.division || "");
  }, [position?.division]);

  const handleEdit = () => {
    if (position && editedTitle.trim() !== "" && onEdit) {
      onEdit(position.id, editedTitle, index);
      setIsEditing(false);
    }
  };

  const handleDivisionChange = (event: any) => {
    const newDivisionId = event.target.value;
    setSelectedDivision(newDivisionId);
    if (position) {
      updatePosition.mutate({
        id: position.id,
        division: newDivisionId,
      });
    }
  };

  if (isNew) {
    return (
      <Fab
        color="primary"
        size="small"
        onClick={onAdd}
        disabled={isLoading}
        sx={{ width: 40, height: 40 }}
      >
        <AddIcon />
      </Fab>
    );
  }

  if (!position) return null;

  return (
    <Draggable draggableId={position.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="relative"
          style={{
            ...provided.draggableProps.style,
          }}
        >
          <PositionCardContent
            position={position}
            isEditing={isEditing}
            editedTitle={editedTitle}
            isLoading={isLoading}
            divisions={divisions}
            selectedDivision={selectedDivision}
            assignedEmployees={assignedEmployees}
            onEdit={() => setIsEditing(true)}
            onDelete={() => onDelete?.(position.id)}
            onTitleChange={setEditedTitle}
            onTitleSave={handleEdit}
            onDivisionChange={handleDivisionChange}
            onAddPosition={onAdd ?? (() => {})}
            onEmployeeManage={() => setIsEmployeeDialogOpen(true)}
            isEmployeeDialogOpen={isEmployeeDialogOpen}
            onEmployeeDialogClose={() => setIsEmployeeDialogOpen(false)}
          />
        </div>
      )}
    </Draggable>
  );
};

export default PositionCard;
