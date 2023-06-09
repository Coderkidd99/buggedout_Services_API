const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');


const app = express();

app.use(cors());
// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());


app.use('/api/tasks', require('./routes'));

app.get('/', (req, res) => {
  res.send('Hello from API Index Page!, Are you Lost?');
});

module.exports = app;
