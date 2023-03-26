const pool = require('./db');


pool.query('SELECT * FROM tasks', (err, res) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log(res.rows);
  }
  pool.end();
});