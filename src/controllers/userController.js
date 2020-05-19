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
