const { uploadToCloudinary } = require('./clodinary');
const { createToken } = require('./jwt');
const { getFormData } = require('./parseForm');
const { removePass } = require('./removePassword');

module.exports = {
    uploadToCloudinary,
    createToken,
    getFormData,
    removePass
}