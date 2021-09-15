const env = process.env.NODE_ENV || 'development';

const config = {
	development: {
		PORT: process.env.PORT || 3030,
		DB_CONNECTION: 'mongodb://127.0.0.1:27017',
		COOKIE_NAME: 'X-Authorization',
		SECRET: 'very strong secret',
		SALT_ROUNDS: 10,
		CLOUDINARY: {
			cloud_name: process.env.CLOUDINARY_NAME, // enter your cloud name from cloudinary account
			api_key: process.env.CLOUDINARY_KEY, // enter your cloud key from cloudinary account
			api_secret: process.env.CLOUDINARY_SECRET // enter your cloud secret from cloudinary account
		},
		CORS: {
			origin: ['http://localhost:3000'],
			credentials: true
		}
	},
	production: {}
};

module.exports = config[env];