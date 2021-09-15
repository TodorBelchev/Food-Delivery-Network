function getFormData(req, form) {
	return new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) { reject(err) }
			resolve([fields, files]);
		});
	})
}

module.exports = {
	getFormData
}