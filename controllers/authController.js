const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const config = require("../config");

function register(req, res) {
  const { email, password } = req.body;

  // Check if user already exists
  db.query("SELECT * FROM users WHERE email = $1", [email], (error, results) => {
    if (error) {
      throw error;
    }

    if (results.rows.length > 0) {
      return res.status(409).send("User already exists");
    }

    // Hash password and insert new user into database
    bcrypt.hash(password, 10, (error, hash) => {
      if (error) {
        throw error;
      }

      db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [email, hash],
        (error, results) => {
          if (error) {
            throw error;
          }

          res.status(201).send("User registered successfully");
        }
      );
    });
  });
}

function login(req, res) {
  const { email, password } = req.body;

  // Check if user exists
  db.query("SELECT * FROM users WHERE email = $1", [email], (error, results) => {
    if (error) {
      throw error;
    }

    if (results.rows.length == 0) {
      return res.status(401).send("Invalid credentials");
    }

    // Compare password hash
    bcrypt.compare(password, results.rows[0].password, (error, result) => {
      if (error) {
        throw error;
      }

      if (!result) {
        return res.status(401).send("Invalid credentials");
      }

      // Create JWT token
      const token = jwt.sign({ id: results.rows[0].id }, config.secret, {
        expiresIn: "1h",
      });

      res.status(200).send({ token });
    });
  });
}

module.exports = { register, login };
