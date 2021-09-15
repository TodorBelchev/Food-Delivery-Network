const mongoose = require('mongoose');

const config = require('./index');

module.exports = () => {
	return new Promise((resolve, reject) => {
		mongoose.connect(config.DB_CONNECTION, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		const db = mongoose.connection;

		db.on('error', (err) => {
			console.error('connection error: ' + err.message);
			reject(err);
		});

		db.on('open', () => {
			console.log('DB connected!');
			resolve();
		});
	});
}