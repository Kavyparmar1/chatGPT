const express = require('express')
const authMiddelware = require('../middleware/auth.middleware')
const chatController = require('../controller/chat.controller')
const router = express.Router()


router.post('/',authMiddelware.authUser,chatController.createChat)
module.exports = router