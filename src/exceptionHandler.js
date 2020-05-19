/* istanbul ignore next */
exports.serverError = (res, err, req) => {
	res.status(500).json({
		status: false,
		errors: err
	})
}

/* istanbul ignore next */
exports.notFound = async (res, err, req) => {
	res.status(404).json({
		status: false,
		errors: err
	})
}