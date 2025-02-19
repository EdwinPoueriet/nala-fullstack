import { promises as fs } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');


const initialDB = {
  positions: [{
    title: "New Position",
    tier: 1,
    x: 0,
    y: 0,
    id: nanoid(),
    division: "3",
  }],
  employees: [
    { id: 'emp-001', name: 'John Martinez', position: null, email: 'john.martinez@company.com' },
    { id: 'emp-002', name: 'Sarah Chen', position: null, email: 'sarah.chen@company.com' },
    { id: 'emp-003', name: 'Michael Rodriguez', position: null, email: 'michael.rodriguez@company.com' },
    { id: 'emp-004', name: 'Emily Johnson', position: null, email: 'emily.johnson@company.com' },
    { id: 'emp-005', name: 'David Kim', position: null, email: 'david.kim@company.com' },
    { id: 'emp-006', name: 'Lisa Wang', position: null, email: 'lisa.wang@company.com' },
    { id: 'emp-007', name: 'Robert Taylor', position: null, email: 'robert.taylor@company.com' },
    { id: 'emp-008', name: 'Amanda Patel', position: null, email: 'amanda.patel@company.com' },
    { id: 'emp-009', name: 'James Wilson', position: null, email: 'james.wilson@company.com' },
    { id: 'emp-010', name: 'Maria Garcia', position: null, email: 'maria.garcia@company.com' }
  ],
  divisions: [
    { id: '1', name: 'Operations' },
    { id: '2', name: 'Sales' },
    { id: '3', name: 'IT' },
    { id: '4', name: 'HR' }
  ],
  tiers: [
    { 
      id: 1, 
      name: 'TIER 1', 
      order: 1, 
      slots: 5,
      positions: [] 
    },
    { 
      id: 2, 
      name: 'TIER 2', 
      order: 2, 
      slots: 5,
      positions: [] 
    },
    { 
      id: 3, 
      name: 'TIER 3', 
      order: 3, 
      slots: 5,
      positions: [] 
    }
  ]
};

async function initializeDB() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      await fs.writeFile(DB_FILE, JSON.stringify(initialDB, null, 2));
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

async function readDB() {
  const data = await fs.readFile(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

async function writeDB(db) {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
}

const dataService = {
  async getPositions() {
    const db = await readDB();
    return db.positions;
  },

  async savePosition(position) {
    const db = await readDB();
    
    const tier = db.tiers.find(t => t.id === position.tier);
    if (!tier) throw new Error('Tier not found');
    
    const slotOccupied = db.positions.some(p => 
      p.tier === position.tier && 
      p.x === position.x &&
      p.id !== position.id
    );
    
    if (slotOccupied) {
      throw new Error('Slot already occupied');
    }

    const newPosition = { 
      ...position, 
      id: nanoid(),
    };
    db.positions.push(newPosition);
    await writeDB(db);
    return newPosition;
  },

  async updatePosition(id, position) {
    const db = await readDB();
    const index = db.positions.findIndex(p => p.id === id);
    if (index === -1) return null;

    if (position.x !== undefined) {
      const slotOccupied = db.positions.some(p => 
        p.tier === position.tier && 
        p.x === position.x &&
        p.id !== id
      );
      
      if (slotOccupied) {
        throw new Error('Slot already occupied');
      }
    }

    db.positions[index] = { 
      ...db.positions[index], 
      ...position 
    };
    
    await writeDB(db);
    return db.positions[index];
  },

  async deletePosition(id) {
    const db = await readDB();
    db.positions = db.positions.filter(p => p.id !== id);
   
    db.employees = db.employees.map(emp => {
      if (emp.position === id) {
        return { ...emp, position: null };
      }
      return emp;
    });
    
    await writeDB(db);
    return true;
  },

  async getDivisions() {
    const db = await readDB();
    return db.divisions;
  },

  async getEmployees() {
    const db = await readDB();
    return db.employees;
  },

  async updateEmployee(id, employee) {
    const db = await readDB();
    const index = db.employees.findIndex(e => e.id === id);
    if (index === -1) return null;

    db.employees[index] = { ...db.employees[index], ...employee };
    await writeDB(db);
    return db.employees[index];
  },

  async getTiers() {
    const db = await readDB();
    return db.tiers.sort((a, b) => a.order - b.order);
  },

  async saveTier(tier) {
    const db = await readDB();
    const lastTier = [...db.tiers].sort((a, b) => b.order - a.order)[0];
    const newTier = {
      ...tier,
      id: Math.max(...db.tiers.map(t => t.id)) + 1,
      order: lastTier ? lastTier.order + 1 : 1,
      positions: []
    };
    
    db.tiers.push(newTier);
    await writeDB(db);
    return newTier;
  },

  async updateTier(id, tierData) {
    const db = await readDB();
    const index = db.tiers.findIndex(t => t.id === id);
    if (index === -1) return null;

    const { order, ...updateData } = tierData;
    const updatedTier = { ...db.tiers[index], ...updateData };
    db.tiers[index] = updatedTier;
    await writeDB(db);
    return updatedTier;
  },

  async deletePositionsByTier(tierId) {
    const db = await readDB();
    
    db.positions = db.positions.filter(p => p.tier !== tierId);
    
    await writeDB(db);
    return true;
  },

   async deleteTier(id) {
    const db = await readDB();
    const tierToDelete = db.tiers.find(t => t.id === id);
    if (!tierToDelete) return false;

    const positionsInTier = db.positions.filter(p => p.tier === id);
    const positionIds = positionsInTier.map(p => p.id);

    db.tiers = db.tiers.filter(t => t.id !== id);

    db.positions = db.positions.filter(p => p.tier !== id);

    db.employees = db.employees.map(emp => {
        if (positionIds.includes(emp.position)) {
            return { ...emp, position: null };
        }
        return emp;
    });

    db.tiers = db.tiers
      .sort((a, b) => a.order - b.order)
      .map((tier, index) => ({ ...tier, order: index + 1 }));

    await writeDB(db);
    return true;
  }
};

await initializeDB();

export default dataService;