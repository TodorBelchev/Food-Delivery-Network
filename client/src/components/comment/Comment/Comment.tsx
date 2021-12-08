import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import useHttp from '../../../hooks/useHttp';
import IComment from '../../../interfaces/IComment';
import IRestaurant from '../../../interfaces/IRestaurant';
import { notificationActions } from '../../../store/notification';
import formatDate from '../../../utils/formatDate';
import restaurantOptions from '../../../utils/restaurantOptions';

import Spinner from '../../UI/Spinner/Spinner';
import EditCommentForm from '../EditCommentForm/EditCommentForm';


import classes from './Comment.module.css';

type CommentProps = JSX.IntrinsicElements['article'] & {
    commentObj: IComment;
    editCommentHandler: (res: { comment: IComment, restaurant: IRestaurant }) => void;
    deleteCommentHandler: (res: { restaurant: IRestaurant; commentId: string }) => void;
}

const Comment: React.FC<CommentProps> = ({ commentObj, editCommentHandler, deleteCommentHandler }) => {
    const dispatch = useAppDispatch();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const restaurant = useAppSelector(state => state.restaurant);
    const { sendRequest, isLoading } = useHttp();
    const { name, comment, rating, date, owner } = commentObj;
    const user = useAppSelector(state => state.auth);
    const formattedDate = formatDate(date);

    useEffect(() => {
        return () => {
            dispatch(notificationActions.close());
        }
    }, [dispatch]);

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
        sendRequest(
            restaurantOptions.deleteComment(restaurant._id, commentObj._id),
            (res: IRestaurant) => deleteCommentHandler({ restaurant: res, commentId: commentObj._id })
        );
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
            {isEditMode && !isDeleteMode &&
                <EditCommentForm setIsEditMode={setIsEditMode} comment={commentObj} editCommentHandler={editCommentHandler} />}
            {!isEditMode && isDeleteMode && !isLoading &&
                <article className={`${classes.comment} ${classes.delete}`}>
                    <h4 className={classes['delete-title']}>Are you sure?</h4>
                    <button
                        className={`${classes['comment-delete-btn']} ${classes['comment-delete-btn--red']}`}
                        onClick={deleteSubmitHandler}
                    >
                        Delete
                    </button>
                    <button className={classes['comment-edit-btn']} onClick={cancelDeleteClickHandler}>Cancel</button>
                </article>}
            {isLoading && <div className={classes['background']}><Spinner size='medium' /></div>}
        </>
    )
}

export default Comment;