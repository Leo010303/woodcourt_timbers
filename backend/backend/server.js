require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', 
    'https://woodcourt-timbers-frontend.onrender.com',  // Your production frontend
    'https://woodcourt-timbers-frontend.vercel.app',    // If you use Vercel
    'https://woodcourt-timbers.netlify.app'             // If you use Netlify
  ],
  credentials: true
}));
app.use(express.json());

// Ensure uploads folder exists
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,9)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
});

// Simple admin auth
const ADMIN_PASS = process.env.ADMIN_PASS || '@Leo1234';

// DEBUG: Log the password status (remove this after testing)
console.log('=== DEBUG INFO ===');
console.log('Admin password from env:', process.env.ADMIN_PASS ? 'SET' : 'NOT SET');
console.log('Using password:', ADMIN_PASS);
console.log('Password length:', ADMIN_PASS.length);
console.log('==================');

function requireAdmin(req, res, next) {
  const { password } = req.headers;
  
  // DEBUG: Log the incoming password attempt
  console.log('=== LOGIN ATTEMPT ===');
  console.log('Received password:', password);
  console.log('Expected password:', ADMIN_PASS);
  console.log('Passwords match:', password === ADMIN_PASS);
  console.log('====================');
  
  if (password === ADMIN_PASS) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

// Upload endpoint (admin only)
app.post('/api/upload', requireAdmin, upload.array('files', 20), (req, res) => {
  const files = req.files.map(f => ({ 
    url: `/uploads/${f.filename}`, 
    originalName: f.originalname, 
    size: f.size,
    filename: f.filename,
    type: f.mimetype.startsWith('video') ? 'video' : 'image'
  }));
  res.json({ success: true, files });
});

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOAD_DIR));

// Delete file endpoint (admin only)
app.delete('/api/uploads/:filename', requireAdmin, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(UPLOAD_DIR, filename);
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Get all media files
app.get('/api/media', (req, res) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR).map(fn => ({
      filename: fn,
      url: `/uploads/${fn}`,
      type: fn.endsWith('.mp4') || fn.endsWith('.webm') || fn.endsWith('.mov') ? 'video' : 'image'
    }));
    res.json({ media: files });
  } catch (error) {
    res.json({ media: [] });
  }
});

// Products with prices
let products = [];

// Try to load products from file
try {
  if (fs.existsSync('products.json')) {
    const data = fs.readFileSync('products.json', 'utf8');
    products = JSON.parse(data);
  }
} catch (error) {
  console.log('No products file found, using defaults');
}

// If no products loaded, use defaults
if (products.length === 0) {
  products = [
    { 
      id: 1, 
      name: 'Pine Timber', 
      price: '$12 per meter', 
      description: 'High-quality pine timber for construction and furniture'
    },
    { 
      id: 2, 
      name: 'Gum Poles', 
      price: '$8 per pole', 
      description: 'Durable gum poles for fencing and structural support'
    },
    { 
      id: 3, 
      name: 'Hardwood Timber', 
      price: '$18 per meter', 
      description: 'Premium hardwood for durable construction projects'
    },
    { 
      id: 4, 
      name: 'Roof Trusses', 
      price: '$45 each', 
      description: 'Pre-made roof trusses for quick installation'
    }
  ];
}

// Save products to file
function saveProducts() {
  fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
}

// Products endpoints
app.get('/api/products', (req, res) => res.json({ products }));

// Update product price
app.put('/api/products/:id', requireAdmin, (req, res) => {
  const productId = parseInt(req.params.id);
  const { price, name, description } = req.body;
  
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  if (price) products[productIndex].price = price;
  if (name) products[productIndex].name = name;
  if (description) products[productIndex].description = description;
  
  saveProducts();
  res.json({ success: true, product: products[productIndex] });
});

// Add new product
app.post('/api/products', requireAdmin, (req, res) => {
  const { name, price, description } = req.body;
  const newProduct = {
    id: Date.now(),
    name,
    price,
    description
  };
  
  products.push(newProduct);
  saveProducts();
  res.json({ success: true, product: newProduct });
});

// Delete product
app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  products.splice(productIndex, 1);
  saveProducts();
  res.json({ success: true });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Woodcourt Timbers API is running' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));