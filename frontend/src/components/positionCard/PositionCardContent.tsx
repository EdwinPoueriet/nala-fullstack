import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  TextField, 
  Select, 
  MenuItem,
  Fab,
  Tooltip,
  Box,
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  Business as BusinessIcon,
  Groups as GroupsIcon
} from '@mui/icons-material';
import EmployeeModal from './EmployeeModal';
import { PositionCardContentProps } from "../../types/organigram";


const PositionCardContent: React.FC<PositionCardContentProps> = ({
    position,
    isEditing,
    editedTitle,
    isLoading,
    divisions,
    selectedDivision,
    assignedEmployees,
    onEdit,
    onDelete,
    onTitleChange,
    onTitleSave,
    onDivisionChange,
    onAddPosition,
    onEmployeeManage,
    isEmployeeDialogOpen,
    onEmployeeDialogClose,
  }) => {
    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        onTitleSave();
      }
    };
  
    return (
      <Card 
        sx={{ 
          width: 280,
          transition: 'all 0.2s',
          '&:hover': {
            boxShadow: 3,
          }
        }}
      >
        <CardContent sx={{ pb: '16px !important' }}>
          <Box sx={{ mb: 2 }}>
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                value={editedTitle}
                onChange={(e) => onTitleChange(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={onTitleSave}
                placeholder="Position title"
                disabled={isLoading}
                autoFocus
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" component="div">
                  {position.title}
                </Typography>
                <Box>
                  <IconButton 
                    size="small" 
                    onClick={onEdit}
                    disabled={isLoading}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={onDelete}
                    disabled={isLoading}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
  
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <GroupsIcon sx={{ mr: 1, fontSize: 20 }} color="action" />
            <Typography variant="body2" color="text.secondary">
              {assignedEmployees.length} employees
            </Typography>
            <Tooltip title="Manage Employees">
              <IconButton 
                size="small" 
                onClick={onEmployeeManage}
                sx={{ ml: 'auto' }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
  
          <EmployeeModal
            open={isEmployeeDialogOpen}
            onClose={onEmployeeDialogClose}
            position={position}
          />
  
          {divisions.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon sx={{ fontSize: 20 }} color="action" />
              <Select
                fullWidth
                size="small"
                value={selectedDivision}
                onChange={onDivisionChange}
                disabled={isLoading}
                sx={{ 
                  '& .MuiSelect-select': { 
                    display: 'flex', 
                    alignItems: 'center' 
                  }
                }}
              >
                <MenuItem value="">
                  <em>No division</em>
                </MenuItem>
                {divisions.map(division => (
                  <MenuItem key={division.id} value={division.id}>
                    {division.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}
        </CardContent>
  
        <Box sx={{ position: 'absolute', left: '50%', bottom: -20, transform: 'translateX(-50%)' }}>
          <Fab
            size="small"
            color="primary"
            onClick={onAddPosition}
            disabled={isLoading}
            sx={{ width: 40, height: 40 }}
          >
            <AddIcon />
          </Fab>
        </Box>
      </Card>
    );
  };
  
  export default PositionCardContent;