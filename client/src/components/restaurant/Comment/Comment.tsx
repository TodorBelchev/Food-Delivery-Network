import { useState } from 'react';

import { useAppSelector } from '../../../hooks/redux-hooks';
import IComment from '../../../interfaces/IComment';
import EditCommentForm from '../EditCommentForm/EditCommentForm';


import classes from './Comment.module.css';

type CommentProps = JSX.IntrinsicElements['article'] & {
    commentObj: IComment;
    editCommentHandler: (comment: IComment) => void;
}

const Comment: React.FC<CommentProps> = ({ commentObj, editCommentHandler }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const { name, comment, rating, date, owner } = commentObj;
    const user = useAppSelector(state => state.auth);
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth();
    const year = newDate.getFullYear();
    const editClickHandler = () => {
        setIsEditMode(true);
    }

    return (
        <>
            {!isEditMode && <article className={classes.comment}>
                <div className={classes['comment-header']}>
                    <h4 className={classes['comment-header-title']}>
                        {name}
                        {user._id === owner ? <button onClick={editClickHandler} className={classes['comment-edit-btn']}>Edit comment</button> : null}
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
                <p className={classes['comment-date']}>{`${day}/${month}/${year}`}</p>
                <p className={classes['comment-text']}>{comment}</p>
            </article>}
            {isEditMode && <EditCommentForm setIsEditMode={setIsEditMode} comment={commentObj} editCommentHandler={editCommentHandler} />}
        </>
    )
}

export default Comment;