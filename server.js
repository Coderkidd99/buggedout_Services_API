const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');


const app = express();

app.use(cors());
app.use(express.json());


// Routes
app.use('/users', require('./authRoutes'));
app.use('/tasks', require('./routes'));

app.get('/', (req, res) => {
  res.send('Hello from homepage!');
});

module.exports = app;
