const Comment = require('../models/Comment');


const createComment = (data) => {
    const comment = new Comment(data);
    return comment.save();
}

const getCommentsByRestaurantIdAndPage = (restaurantId, page = 0) => {
    return Comment.find({ restaurant: restaurantId }).sort({ date: 'desc' }).skip(page * 10).limit(10);
}

const getCommentById = (id) => {
    return Comment.findById(id);
}

const getCommentsCountByRestaurantId = (restaurant) => {
    return Comment.estimatedDocumentCount({ restaurant });
}

const getAllRatingsByRestaurantId = (restaurant) => {
    return Comment.find({ restaurant });
}

module.exports = {
    createComment,
    getCommentsByRestaurantIdAndPage,
    getCommentById,
    getCommentsCountByRestaurantId,
    getAllRatingsByRestaurantId
}