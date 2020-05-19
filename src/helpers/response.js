function success(res, message, data, statusCode) {
    let response = {
        status: true,
        message: message,
        data: data,
    }
    return res.status(statusCode).json(response)
}

function error(res, message, err, statusCode) {
    let response = {
        status: false,
        message: message,
        data: null,
        errors: err,
    }
    return res.status(statusCode).json(response)
}

module.exports = {
    success,
    error
}
