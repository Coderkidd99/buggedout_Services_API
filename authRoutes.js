const authController = require('./controllers/authController');
const { Router } = require('express');

const router = Router();

//users
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;