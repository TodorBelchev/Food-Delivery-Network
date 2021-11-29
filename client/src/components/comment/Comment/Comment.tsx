import { useState } from 'react';

import { useAppSelector } from '../../../hooks/reduxHooks';
import useHttp from '../../../hooks/useHttp';
import IComment from '../../../interfaces/IComment';
import formatDate from '../../../utils/formatDate';

import EditCommentForm from '../EditCommentForm/EditCommentForm';


import classes from './Comment.module.css';

type CommentProps = JSX.IntrinsicElements['article'] & {
    commentObj: IComment;
    editCommentHandler: (comment: IComment) => void;
    deleteCommentHandler: (commentId: string) => void;
}

const Comment: React.FC<CommentProps> = ({ commentObj, editCommentHandler, deleteCommentHandler }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const { sendRequest } = useHttp();
    const { name, comment, rating, date, owner } = commentObj;
    const user = useAppSelector(state => state.auth);
    const formattedDate = formatDate(date);

    const editClickHandler = () => {
        setIsEditMode(true);
    };

    const deleteClickHandler = () => {
        setIsDeleteMode(true);
    };

    const cancelDeleteClickHandler = () => {
        setIsDeleteMode(false);
    };

    const deleteSubmitHandler = () => {
        sendRequest({
            url: `http://localhost:3030/api/restaurant/comment/${commentObj._id}`,
            method: 'DELETE'
        }, () => deleteCommentHandler(commentObj._id));
    }

    return (
        <>
            {!isEditMode && !isDeleteMode && <article className={classes.comment}>
                <div className={classes['comment-header']}>
                    <h4 className={classes['comment-header-title']}>
                        {name}
                        {user._id === owner ? <button onClick={editClickHandler} className={classes['comment-edit-btn']}>Edit</button> : null}
                        {user._id === owner ? <button onClick={deleteClickHandler} className={`${classes['comment-delete-btn']} ${classes['comment-delete-btn--red']}`}>Delete</button> : null}
                    </h4>
                    <div className={classes.rating}>
                        <label>
                            <span className={`${classes.icon} ${rating >= 1 ? '' : classes['icon--gray']}`}>★</span>
                            <span className={`${classes.icon} ${rating >= 2 ? '' : classes['icon--gray']}`}>★</span>
                            <span className={`${classes.icon} ${rating >= 3 ? '' : classes['icon--gray']}`}>★</span>
                            <span className={`${classes.icon} ${rating >= 4 ? '' : classes['icon--gray']}`}>★</span>
                            <span className={`${classes.icon} ${rating >= 5 ? '' : classes['icon--gray']}`}>★</span>
                        </label >
                    </div >
                </div >
                <p className={classes['comment-date']}>{formattedDate}</p>
                <p className={classes['comment-text']}>{comment}</p>
            </article>}
            {isEditMode &&
                !isDeleteMode &&
                <EditCommentForm setIsEditMode={setIsEditMode} comment={commentObj} editCommentHandler={editCommentHandler} />}
            {!isEditMode && isDeleteMode && <article className={`${classes.comment} ${classes.delete}`}>
                <h4 className={classes['delete-title']}>Are you sure?</h4>
                <button
                    className={`${classes['comment-delete-btn']} ${classes['comment-delete-btn--red']}`}
                    onClick={deleteSubmitHandler}
                >
                    Delete
                </button>
                <button className={classes['comment-edit-btn']} onClick={cancelDeleteClickHandler}>Cancel</button>
            </article>}
        </>
    )
}

export default Comment;