import IComment from '../../../interfaces/IComment';


import classes from './Comment.module.css';

type CommentProps = JSX.IntrinsicElements['article'] & {
    commentObj: IComment
}

const Comment: React.FC<CommentProps> = ({ commentObj }) => {
    const { name, comment, rating, date } = commentObj;
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth();
    const year = newDate.getFullYear();
    return (
        <article className={classes.comment}>
            <div className={classes['comment-header']}>
                <h4 className={classes['comment-header-title']}>{name}</h4>
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
        </article>
    )
}

export default Comment;