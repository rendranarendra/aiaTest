exports.serverError = (err, req, res) => {
	res.status(500).json({
		status: false,
		errors: err
	})
}

exports.notFound = async (err, req, res) => {	
	res.status(404).json({
		status: false,
		errors: err
	})
}
