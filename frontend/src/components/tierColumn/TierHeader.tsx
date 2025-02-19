import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton } from '@mui/material';
import { 
    Edit as Pencil, 
    Delete as Trash2, 
  } from '@mui/icons-material';
import { TierHeaderProps } from '../../types/organigram';


const TierHeader = ({ name, tierId, onRename, onDelete }: TierHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState(name);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setNewName(name);
  };

  const handleRename = () => {
    if (newName.trim()) {
      onRename(tierId, newName);
      setIsOpen(false);
    }
  };

  const handleDelete = () => {
    onDelete();
    setShowConfirmDelete(false);
    setIsOpen(false);
  };

  return (
    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-200 flex items-center justify-center group">
      <div 
        className="relative cursor-pointer flex items-center gap-2" 
        onClick={handleOpen}
      >
        <span className="text-xs text-gray-600 transform -rotate-90 whitespace-nowrap">
          {name}
        </span>
        <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity absolute -right-4 top-0 text-gray-500" />
      </div>

      <Dialog 
        open={isOpen} 
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Edit Tier
        </DialogTitle>
        <DialogContent>
          <div className="mt-4 space-y-4">
            <TextField
              autoFocus
              label="Tier Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
            <div className="flex items-center text-red-600 hover:bg-red-50 rounded-md p-2 cursor-pointer"
                 onClick={() => setShowConfirmDelete(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              <span className="text-sm">Delete Tier</span>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleRename} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete this tier? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDelete(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TierHeader;