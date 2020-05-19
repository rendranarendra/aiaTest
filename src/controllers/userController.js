const User = require('../models/user.js')
const {
    success,
    error
} = require('../helpers/response.js')

exports.create = async (req, res) => {
    try {
        let result = await User.register(req.body)
        let message = "Your account has been created"
        success(res, message, result, 201)
    }
    catch (err) {
        let message = "A problem has been encountered while creating your account"
        error(res, message, err, 422)
    }
}

exports.auth = async (req, res) => {
    try {
        let result = await User.login(req.body)
        let message = "You've successfully logged in"
        success(res, message, result, 200)
    }
    catch (err) {
        let message = "Login failed"
        error(res, message, err, 422)
    }
}

exports.current = async (req, res) => {
    let result = await User.me(req.user._id)
    let message = "Current user information: "
    success(res, message, result, 200)
}

exports.update = async (req, res) => {
    try {
        let result = await User.edit(req.user._id, req.body)
        let message = "Your profile has been successfully updated"
        success(res, message, result, 201)
    }
    catch (err) {
        let message = "Profile updated failed"
        error(res, message, err, 422)
    }
}
