const router = require('express').Router()
const { catchErrors } = require('../handlers/errorHandlers')
const conversationController = require('../controllers/conversationController')
const auth = require('../middlewares/auth')

router.get('/',auth, catchErrors(conversationController.getConversations))
router.post('/messages',auth, catchErrors(conversationController.getConversationMessages))
router.post('/',auth, catchErrors(conversationController.newConversation))

module.exports = router