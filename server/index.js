const express = require('express');
const path = require('path');

const config = require('./config');
const cloudinary = require('cloudinary').v2;
const expressSetup = require('./config/express');
const mongooseSetup = require('./config/mongoose');

const allowed = [
    ".js",
    ".css",
    ".png",
    ".jpg",
    ".ico"
];

const createApp = async (dbSetup) => {
	const app = express();
	expressSetup(app);
	cloudinary.config(config.CLOUDINARY);
	await dbSetup();

	app.get("*", (req, res) => {
		if (allowed.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
			res.sendFile(path.resolve(`public/${req.url}`));
		} else {
			res.sendFile(path.join(__dirname, "public/index.html"));
		}
	});

	app.listen(config.PORT, () => console.log(`Server is listening on port ${config.PORT}`));
};

createApp(mongooseSetup);

module.exports = createApp;