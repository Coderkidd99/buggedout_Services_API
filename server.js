const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');


const app = express();

app.use(cors());
// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());


// Routes
app.use('/users', require('./authRoutes'));
app.use('/tasks', require('./routes'));

app.get('/', (req, res) => {
  res.send('Hello from homepage!');
});

module.exports = app;
