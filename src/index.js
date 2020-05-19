const express = require('express')
const app = express();

const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
dotenv.config()

//database
require('./database.js')

//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//cors and morgan
app.use(cors())
app.use(morgan('tiny'))

//router
const router = require('./router')
app.use('/api/v1', router)

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: 'Welcome to api'
    })
})

// const {
//     notFound,
//     serverError
// } = require('./exceptionHandler.js')

// app.use(serverError)
// app.use(notFound)

module.exports = app
