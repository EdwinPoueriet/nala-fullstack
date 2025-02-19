import express from 'express';
import dataService from '../services/dataService.js';

const router = express.Router();

// Positions
router.get('/positions', async (req, res) => {
  try {
    const positions = await dataService.getPositions();
    res.json({ success: true, data: positions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching positions' });
  }
});


router.post('/positions', async (req, res) => {
  try {
    const newPosition = await dataService.savePosition(req.body);
    res.status(201).json({ success: true, data: newPosition });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error creating position' });
  }
});


router.put('/positions/:id', async (req, res) => {
  try {
    const updatedPosition = await dataService.updatePosition(req.params.id, req.body);
    if (!updatedPosition) {
      return res.status(404).json({ success: false, error: 'Position not found' });
    }
    res.json({ success: true, data: updatedPosition });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error updating position' });
  }
});


router.delete('/positions/:id', async (req, res) => {
  try {
    await dataService.deletePosition(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error deleting position' });
  }
});

// Divisions
router.get('/divisions', async (req, res) => {
  try {
    const divisions = await dataService.getDivisions();
    res.json({ success: true, data: divisions });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching divisions' });
  }
});

// Tiers
router.get('/tiers', async (req, res) => {
  try {
    const tiers = await dataService.getTiers();
    res.json({ success: true, data: tiers });
  } catch (error) {
    console.error('Error fetching tiers:', error);
    res.status(500).json({ success: false, error: 'Error fetching tiers' });
  }
});


router.post('/tiers', async (req, res) => {
  try {
    const newTier = await dataService.saveTier(req.body);
    res.status(201).json({ success: true, data: newTier });
  } catch (error) {
    console.error('Error creating tier:', error);
    res.status(500).json({ success: false, error: 'Error creating tier' });
  }
});


router.put('/tiers/:id', async (req, res) => {
  try {
    const updatedTier = await dataService.updateTier(parseInt(req.params.id), req.body);
    if (!updatedTier) {
      return res.status(404).json({ success: false, error: 'Tier not found' });
    }
    res.json({ success: true, data: updatedTier });
  } catch (error) {
    console.error('Error updating tier:', error);
    res.status(500).json({ success: false, error: 'Error updating tier' });
  }
});


router.delete('/tiers/:id', async (req, res) => {
  try {
    await dataService.deleteTier(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting tier:', error);
    res.status(500).json({ success: false, error: 'Error deleting tier' });
  }
});


router.delete('/positions/by-tier/:tierId', async (req, res) => {
  try {
    await dataService.deletePositionsByTier(parseInt(req.params.tierId));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting tier positions:', error);
    res.status(500).json({ success: false, error: 'Error deleting tier positions' });
  }
});

// Employees
router.get('/employees', async (req, res) => {
  try {
    const employees = await dataService.getEmployees();
    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching employees' });
  }
});


router.put('/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await dataService.updateEmployee(req.params.id, req.body);
    if (!updatedEmployee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }
    res.json({ success: true, data: updatedEmployee });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error updating employee' });
  }
});

export default router;