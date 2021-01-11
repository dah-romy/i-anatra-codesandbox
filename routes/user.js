const router = require('express').Router()
const { catchErrors } = require('../handlers/errorHandlers')
const userController = require('../controllers/userController')

const auth = require('../middlewares/auth')

router.get('/',auth, catchErrors(userController.list))
router.get('/contacts',auth, catchErrors(userController.contacts))
router.post('/',auth, catchErrors(userController.new))
router.get('/:id',auth, catchErrors(userController.getUser))
router.put('/:id',auth, catchErrors(userController.edit))
router.delete('/:id',auth, catchErrors(userController.delete))

module.exports = router