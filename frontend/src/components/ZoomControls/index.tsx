import { IconButton } from '@mui/material';
import {Add as Plus, Remove as Minus } from '@mui/icons-material'; 

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const ZoomControls = ({ onZoomIn, onZoomOut }: ZoomControlsProps) => {
  return (
    <div className="fixed top-4 right-4 flex flex-col space-y-2 bg-white rounded-lg shadow-md p-2">
      <IconButton onClick={onZoomIn} size="small">
        <Plus className="h-5 w-5" />
      </IconButton>
      <IconButton onClick={onZoomOut} size="small">
        <Minus className="h-5 w-5" />
      </IconButton>
    </div>
  );
};

export default ZoomControls;