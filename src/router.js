const express = require('express')
const router = express.Router()

const user = require('./controllers/userController.js')
const flickr = require('./controllers/imageController.js')

//Middlewares
const authenticate = require('./middlewares/authenticate.js')

//Flickr api
router.get('/flickr', flickr.getImage)

//User router
router.post('/users', user.create)
router.post('/auth', user.auth)
router.get('/users', authenticate, user.current)


module.exports = router