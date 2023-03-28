const { Router } = require('express');
const controller = require('./controllers/controller')

const router = Router();

router.get('/', controller.getUserData)
router.get('/:id', controller.getUserDataById)
router.post('/', controller.addUserData)
router.delete('/:id',controller.deleteUserData)
router.put('/:id', controller.updateUserData)

module.exports = router;