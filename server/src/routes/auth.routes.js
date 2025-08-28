const express = require('express')
const router = express.Router()
const authController = require('../controller/auth.controller')

router.post('/register', authController.registerController)
router.post('/login',authController.loginController)
module.exports = router