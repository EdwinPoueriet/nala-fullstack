import { useState } from 'react';
import { Position, Employee } from '../../types/organigram';
import { useEmployees } from '../../hooks/useEmployees';
import { 
  Typography, 
  IconButton, 
  TextField, 
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Autocomplete
} from '@mui/material';

import {
  Delete as DeleteIcon,
  Email as EmailIcon,
  Close as CloseIcon
} from '@mui/icons-material';


const EmployeeModal: React.FC<{
    open: boolean;
    onClose: () => void;
    position: Position;
  }> = ({ open, onClose, position }) => {
    
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    
    const { 
      getAvailableEmployees, 
      getPositionEmployees,
      assignEmployee,
      removeEmployee
    } = useEmployees();
  
    const availableEmployees = getAvailableEmployees();
    const assignedEmployees = getPositionEmployees(position.id);
  
    const handleAssignEmployee = async () => {
      if (selectedEmployee) {
        await assignEmployee.mutate({
          employeeId: selectedEmployee.id,
          positionId: position.id
        });
        setSelectedEmployee(null);
      }
    };
  
    const handleRemoveEmployee = async (employeeId: string) => {
      await removeEmployee.mutate(employeeId);
    };
  
    return (
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Manage Employees - {position.title}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Add Employee
            </Typography>
            <Box display="flex" gap={1}>
              <Autocomplete
                fullWidth
                value={selectedEmployee}
                onChange={(_, newValue) => setSelectedEmployee(newValue)}
                options={availableEmployees}
                getOptionLabel={(option) => `${option.name} (${option.email})`}
                renderInput={(params) => (
                  <TextField {...params} size="small" placeholder="Select employee" />
                )}
              />
              <Button
                variant="contained"
                onClick={handleAssignEmployee}
                disabled={!selectedEmployee}
              >
                Assign
              </Button>
            </Box>
          </Box>
  
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Assigned Employees ({assignedEmployees.length})
          </Typography>
          <List>
            {assignedEmployees.map((employee) => (
              <ListItem
                key={employee.id}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={() => handleRemoveEmployee(employee.id)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={employee.name}
                  secondary={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <EmailIcon fontSize="small" />
                      {employee.email}
                    </Box>
                  }
                />
              </ListItem>
            ))}
            {assignedEmployees.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No employees assigned
              </Typography>
            )}
          </List>
        </DialogContent>
      </Dialog>
    );
  };

  export default EmployeeModal;