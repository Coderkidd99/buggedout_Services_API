index.js
const app = require('./server');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.js
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

routes.js
const { Router } = require('express');
const controller = require('./controllers/controller')

const router = Router();

router.get('/', controller.getUserData)
router.get('/:id', controller.getUserDataById)
router.post('/', controller.addUserData)
router.delete('/:id',controller.deleteUserData)
router.put('/:id', controller.updateUserData)

module.exports = router;

queries.js
const getUserData = "SELECT * FROM tasks";
const getUserDataById = "SELECT * FROM tasks WHERE id = $1";
const checkUserIdExists = "SELECT * FROM tasks WHERE userid = $1";
const addUserData ="INSERT INTO tasks (userid, duedate, assignto, taskrole, taskname, description, notes, priority, iscompleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
const updateUserData ="UPDATE tasks SET userid = $1, duedate = $2, assignto = $3, taskrole = $4, taskname = $5, description = $6, notes = $7, priority = $8, iscompleted = $9 WHERE id = $10 RETURNING *";
const deleteUserData = "DELETE FROM tasks WHERE id = $1 RETURNING *";
const addNewUserData = "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *";
const checkUserEmail = "SELECT * FROM users WHERE email = $1";


module.exports = {
  getUserData,
  getUserDataById,
  checkUserIdExists,
  addUserData,
  updateUserData,
  deleteUserData,
  addNewUserData,
  checkUserEmail,
};

db.js
const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    ssl: {
        rejectUnauthorized: false
      }
});

module.exports = pool

authRoutes.js
const authController = require('./controllers/authController');
const { Router } = require('express');

const router = Router();

//users
router.get('/', (req, res) => {
    res.send('This is the /users endpoint');
  });

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;

controller.js
const { parse } = require("dotenv");
const pool = require("../db");
const queries = require("../queries");


const errorHandler = (error, res) => {
  console.error(error);
  res.status(500).send("Server Error");
};

const getUserData = async (req, res) => {
  try {
    const results = await pool.query(queries.getUserData);
    res.status(200).json(results.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUserDataById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const results = await pool.query(queries.getUserDataById, [id]);
    res.status(200).json(results.rows);
  } catch (error) {
    errorHandler(error, res);
  }
};

const addUserData = async (req, res) => {
  const {
    userid,
    duedate,
    assignto,
    taskrole,
    taskname,
    description,
    notes,
    priority,
    iscompleted,
  } = req.body;


  try {
    const checkResults = await pool.query(queries.checkUserIdExists, [userid]);
    if (checkResults.rows.length) {
      throw new Error("Task already exists");
    }
    const addResults = await pool.query(
      queries.addUserData,
      [
        userid,
        duedate,
        assignto,
        taskrole,
        taskname,
        description,
        notes,
        priority,
        iscompleted,
      ]
    );
    res.status(201).send(`Task added with ID: ${addResults.rows[0].id}`);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateUserData = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    userid,
    duedate,
    assignto,
    taskrole,
    taskname,
    description,
    notes,
    priority,
    iscompleted,
  } = req.body;

  try {
    const updateResults = await pool.query(
      queries.updateUserData,
      [
        userid,
        duedate,
        assignto,
        taskrole,
        taskname,
        description,
        notes,
        priority,
        iscompleted,
        id,
      ]
    );
    res.status(200).send(`Task modified with ID: ${id}`);
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteUserData = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const results = await pool.query(queries.getUserDataById, [id]);

    if (!results.rows.length) {
      throw new Error("Task doesn't exist in the database");
    }

    await pool.query(queries.deleteUserData, [id]);

    res.status(200).send(`User data deleted with ID: ${id}`);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getUserData,
  getUserDataById,
  addUserData,
  updateUserData,
  deleteUserData,
};

authController.js
const bcrypt = require('bcryptjs');
const { query } = require('express');
const pool = require("../db");
const queries = require("../queries");


const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user with this email already exists
    const user = await pool.query(queries.checkUserEmail, [email]);

    if (user.rows.length) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into the database
    const newUser = await pool.query(
      queries.addNewUserData,
      [email, hashedPassword]
    );

    res.status(201).json({ user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user with this email exists
    const user = await pool.query(query.checkUserEmail, [email]);

    if (!user.rows.length) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ user: user.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login
};
