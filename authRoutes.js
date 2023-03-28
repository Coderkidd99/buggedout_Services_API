const authController = require('./controllers/authController');
const { Router } = require('express');

const router = Router();

//users
router.get('/', (req, res) => {
    res.send('This is the users endpoint');
  });
  
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
