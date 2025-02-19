import request from 'supertest';
import express from 'express';
import router from '../routes/index';

const app = express();
app.use(express.json());
app.use('/api', router);

describe('API Integration Tests', () => {
  let createdPositionId;
  let createdTierId;

  beforeAll(async () => {
  });

  describe('Complete Organigram Flow', () => {
    test('should create and manage a complete organizational structure', async () => {

      const divisionsResponse = await request(app)
        .get('/api/divisions')
        .expect(200);
      
      expect(divisionsResponse.body.success).toBe(true);
      expect(Array.isArray(divisionsResponse.body.data)).toBe(true);

      const newTierResponse = await request(app)
        .post('/api/tiers')
        .send({
          name: 'Executive',
          slots: 5
        })
        .expect(201);

      expect(newTierResponse.body.success).toBe(true);
      createdTierId = newTierResponse.body.data.id;

      const newPositionResponse = await request(app)
        .post('/api/positions')
        .send({
          title: 'CEO',
          tier: createdTierId,
          x: 0,
          y: 0,
          division: divisionsResponse.body.data[0].id
        })
        .expect(201);

      expect(newPositionResponse.body.success).toBe(true);
      createdPositionId = newPositionResponse.body.data.id;

      await request(app)
        .put(`/api/positions/${createdPositionId}`)
        .send({
          title: 'Chief Executive Officer'
        })
        .expect(200);

      const getPositionResponse = await request(app)
        .get('/api/positions')
        .expect(200);

      const updatedPosition = getPositionResponse.body.data
        .find(p => p.id === createdPositionId);
      expect(updatedPosition.title).toBe('Chief Executive Officer');

      await request(app)
        .put(`/api/tiers/${createdTierId}`)
        .send({
          name: 'C-Suite'
        })
        .expect(200);

      const getTiersResponse = await request(app)
        .get('/api/tiers')
        .expect(200);

      const updatedTier = getTiersResponse.body.data
        .find(t => t.id === createdTierId);
      expect(updatedTier.name).toBe('C-Suite');
    });
  });

  afterAll(async () => {
    if (createdPositionId) {
      await request(app)
        .delete(`/api/positions/${createdPositionId}`)
        .expect(200);
    }

    if (createdTierId) {
      await request(app)
        .delete(`/api/tiers/${createdTierId}`)
        .expect(200);
    }
  });
});