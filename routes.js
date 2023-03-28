const { Router } = require('express');
const controller = require('./controllers/controller')
const authController = require('./controllers/authController');

const router = Router();

router.get('/', controller.getUserData)
router.get('/:id', controller.getUserDataById)
router.post('/', controller.addUserData)
router.delete('/:id',controller.deleteUserData)
router.put('/:id', controller.updateUserData)

//users
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;