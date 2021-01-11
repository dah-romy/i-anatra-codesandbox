const router = require('express').Router()
const { catchErrors } = require('../handlers/errorHandlers')
const departController = require('../controllers/departementController')

const auth = require('../middlewares/auth')

router.post('/',auth, catchErrors(departController.new))
router.get('/',auth, catchErrors(departController.list))
router.put('/:id',auth, catchErrors(departController.edit))
router.delete('/:id',auth, catchErrors(departController.delete))

module.exports = router