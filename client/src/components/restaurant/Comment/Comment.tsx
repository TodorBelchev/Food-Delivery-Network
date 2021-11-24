import classes from './Comment.module.css';

const Comment: React.FC = () => {
    const rating = [3];
    return (
        <article className={classes.comment}>
            <div className={classes['comment-header']}>
                <h4 className={classes['comment-header-title']}>Peter Petrov</h4>
                <div className={classes.rating}>
                    <label>
                        <span className={`${classes.icon} ${rating[0] >= 1 ? '' : classes['icon--gray']}`}>★</span>
                        <span className={`${classes.icon} ${rating[0] >= 2 ? '' : classes['icon--gray']}`}>★</span>
                        <span className={`${classes.icon} ${rating[0] >= 3 ? '' : classes['icon--gray']}`}>★</span>
                        <span className={`${classes.icon} ${rating[0] >= 4 ? '' : classes['icon--gray']}`}>★</span>
                        <span className={`${classes.icon} ${rating[0] >= 5 ? '' : classes['icon--gray']}`}>★</span>
                    </label >
                </div >
            </div >
            <p className={classes['comment-date']}>24.11.2021</p>
            <p className={classes['comment-text']}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo quod iure harum ex delectus nisi exercitationem voluptatibus. Praesentium, error vitae.</p>
        </article >
    )
}

export default Comment;