const getUserData = "SELECT * FROM tasks";
const getUserDataById = "SELECT * FROM tasks WHERE id = $1";
const checkUserIdExists = "SELECT * FROM tasks WHERE userid = $1";
const addUserData ="INSERT INTO tasks (userid, duedate, assignto, taskrole, taskname, description, notes, priority, iscompleted) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
const updateUserData ="UPDATE tasks SET userid = $1, duedate = $2, assignto = $3, taskrole = $4, taskname = $5, description = $6, notes = $7, priority = $8, iscompleted = $9 WHERE id = $10 RETURNING *";
const deleteUserData = "DELETE FROM tasks WHERE id = $1 RETURNING *";


module.exports = {
  getUserData,
  getUserDataById,
  checkUserIdExists,
  addUserData,
  updateUserData,
  deleteUserData,

};
