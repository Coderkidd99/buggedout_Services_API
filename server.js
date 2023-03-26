const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

//add login/register info here

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.use('/tasks', require('./routes'));

app.get('/', (req, res) => {
  res.send('Hello from homepage!');
});

module.exports = app;
