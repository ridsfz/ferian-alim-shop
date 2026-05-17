const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'alishop2024secret';

// MongoDB Connect
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alishop')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Schemas
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String
});
const Product = mongoose.model('Product', productSchema);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String
});
const User = mongoose.model('User', userSchema);

// ===== AUTH ROUTES =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashed, name });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email, name } });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token, access denied' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ===== PRODUCTS (Protected) =====
app.get('/api/products', auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/products', auth, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ===== SEED DATA (Public for demo) =====
app.get('/api/seed', async (req, res) => {
  const seedData = [
    { title:"Sneakers Air", price:499000, image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
    { title:"Backpack Pro", price:349000, image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop" },
    { title:"Smart Watch", price:1299000, image:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=300&fit=crop" },
    { title:"Headphone Wireless", price:899000, image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop" },
    { title:"Smartphone 128GB", price:4599000, image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop" },
    { title:"Laptop Gaming", price:15999000, image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop" },
    { title:"Kamera DSLR", price:8999000, image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop" },
    { title:"iPhone Pro", price:7499000, image:"https://images.pexels.com/photos/5052877/pexels-photo-5052877.jpeg?w=400&h=300&fit=crop" },
    { title:"MacBook Air", price:18999000, image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop" },
    { title:"Rolex Watch", price:125000000, image:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=300&fit=crop" }
  ];
  
  try {
    await Product.deleteMany({});
    await Product.insertMany(seedData);
    res.json({ message: `✅ Seeded ${seedData.length} products!` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Homepage
app.get('/', (req, res) => {
  res.json({ 
    message: 'Ali-Shop API v2.0 (JWT Protected)', 
    status: 'running',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login', 
      'GET /api/seed (demo)',
      'GET /api/products (protected)'
    ]
  });
});

app.listen(PORT, () => {
  console.log(` Ali-Shop API: http://localhost:${PORT}`);
  console.log(` Seed data: http://localhost:${PORT}/api/seed`);
  console.log(` Auth docs: POST /api/auth/login {email, password}`);
});