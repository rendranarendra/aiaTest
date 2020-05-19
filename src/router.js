const express = require('express')
const router = express.Router()

const user = require('./controllers/userController.js')

//User router
router.post('/users', user.create)


module.exports = router