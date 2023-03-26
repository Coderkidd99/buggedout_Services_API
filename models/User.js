const db = require('../db');

class User {
  constructor(id, email, password) {
    this.id = id;
    this.email = email;
    this.password = password;
  }

  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async create(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email', [email, hashedPassword]);
    const { id } = result.rows[0];
    return new User(id, email, hashedPassword);
  }

  static async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return { user, token };
  }
}

module.exports = User;
