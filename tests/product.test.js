const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Product = require('../models/Product');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Product.deleteMany({});
  await User.deleteMany({});
});

describe('Product API', () => {
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      // Create test products
      await Product.create([
        {
          name: 'Test Coffee 1',
          description: 'Test description 1',
          basePrice: 30000,
          category: 'coffee',
          featured: true
        },
        {
          name: 'Test Coffee 2',
          description: 'Test description 2',
          basePrice: 35000,
          category: 'coffee',
          featured: false
        }
      ]);

      const res = await request(app).get('/api/products');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toEqual(2);
    });

    it('should filter products by category', async () => {
      // Create test products
      await Product.create([
        {
          name: 'Test Coffee',
          description: 'Test description',
          basePrice: 30000,
          category: 'coffee',
          featured: true
        },
        {
          name: 'Test Tea',
          description: 'Test description',
          basePrice: 35000,
          category: 'tea',
          featured: false
        }
      ]);

      const res = await request(app).get('/api/products?category=coffee');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toEqual(1);
      expect(res.body.data[0].name).toEqual('Test Coffee');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product', async () => {
      // Create test product
      const product = await Product.create({
        name: 'Test Coffee',
        description: 'Test description',
        basePrice: 30000,
        category: 'coffee',
        featured: true
      });

      const res = await request(app).get(`/api/products/${product._id}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toEqual('Test Coffee');
    });

    it('should return 404 if product not found', async () => {
      const res = await request(app).get('/api/products/60f7b0b9e1b9a52f8c9a9b0a');
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
    });
  });

  // Add more tests for POST, PUT, DELETE routes
});