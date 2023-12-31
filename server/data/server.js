const express = require('express');
const bodyParser = require('body-parser');
const ProductFsManager = require('./Fs/files/products.fs.js');
const UserFsManager = require('./Fs/files/users.fs.js');
const ProductMemoryManager = require('./memory/products.memory.js');
const UserMemoryManager = require('./memory/users.memory.js');
const CartFsManager = require('./Fs/files/carts.fs.js');
const CartMemoryManager = require('./memory/cart.memory.js');


const app = express();
const PORT = 8080;

app.use(bodyParser.json());

const productManager = process.env.USE_MEMORY_MANAGER === 'true' ? new ProductMemoryManager() : new ProductFsManager('./Fs/files/productos.json');
const userManager = process.env.USE_MEMORY_MANAGER === 'true' ? new UserMemoryManager() : new UserFsManager('./Fs/files/users.json');
const cartManager = process.env.USE_MEMORY_MANAGER === 'true' ? new CartMemoryManager() : new CartFsManager('./Fs/files/carts.json');

// Products Endpoints
app.get('/api/products', async (req, res) => {
  const products = await productManager.read();
  if (products.length > 0) {
    res.json({ success: true, response: products });
  } else {
    res.status(404).json({ success: false, message: 'not found!' });
  }
});

app.get('/api/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  const product = await productManager.readOne(productId);

  if (product) {
    res.json({ success: true, response: product });
  } else {
    res.status(404).json({ success: false, message: 'not found!' });
  }
});

// Users Endpoints
app.get('/api/users', async (req, res) => {
  const users = await userManager.read();
  if (users.length > 0) {
    res.json({ success: true, response: users });
  } else {
    res.status(404).json({ success: false, message: 'not found!' });
  }
});

app.get('/api/users/:uid', async (req, res) => {
  const userId = req.params.uid;
  const user = await userManager.readOne(userId);

  if (user) {
    res.json({ success: true, response: user });
  } else {
    res.status(404).json({ success: false, message: 'not found!' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Carts Endpoints
app.post('/api/carts', async (req, res) => {
  const newCart = await cartManager.create();
  res.json({ success: true, response: newCart });
});

app.get('/api/carts', async (req, res) => {
  const carts = await cartManager.read();
  if (carts.length > 0) {
    res.json({ success: true, response: carts });
  } else {
    res.status(404).json({ success: false, message: 'not found!' });
  }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);

  if (updatedCart) {
    res.json({ success: true, response: updatedCart });
  } else {
    res.status(404).json({ success: false, message: 'not found!' });
  }
});

// ...
