const Comment = require('../models/Comment');


const createComment = (data) => {
    const comment = new Comment(data);
    return comment.save();
}

const getComments = (restaurantId, page) => {
    return Comment.find({ restaurant: restaurantId }).sort({ date: 'desc' }).skip(page * 5).limit(5);
}

const getCommentById = (id) => {
    return Comment.findById(id);
}

const getCommentsCountByRestaurantId = (restaurant) => {
    return Comment.estimatedDocumentCount({ restaurant });
}

module.exports = {
    createComment,
    getComments,
    getCommentById,
    getCommentsCountByRestaurantId
}