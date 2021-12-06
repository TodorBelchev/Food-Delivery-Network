const { getCommentById } = require('../services/commentService');

module.exports = () => async (req, res, next) => {
    try {
        const comment = await getCommentById(req.params.commentId);
        if (comment.owner.toString()  !== req.decoded.id) {
            throw new Error('Not authorized!');
        }
        next();
    } catch (error) {
        res.status(401).send({ message: 'Not authorized' });
    }
}