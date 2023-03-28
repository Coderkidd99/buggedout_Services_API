const { parse } = require("dotenv");
const pool = require("../db");
const queries = require("../queries");
import moment from "moment/moment";
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

  const parsedDate = moment(duedate, 'YYYY-MM-DD').toDate();

  try {
    const checkResults = await pool.query(queries.checkUserIdExists, [userid]);
    if (checkResults.rows.length) {
      throw new Error("Task already exists");
    }
    const addResults = await pool.query(
      queries.addUserData,
      [
        userid,
        parsedDate,
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
