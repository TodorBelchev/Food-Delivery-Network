const Comment = require('../models/Comment');


const createComment = (data) => {
    const comment = new Comment(data);
    return comment.save();
}

const getComments = (restaurantId) => {
    return Comment.find({ restaurant: restaurantId });
}


module.exports = {
    createComment,
    getComments
}