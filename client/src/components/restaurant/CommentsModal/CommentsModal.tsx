import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import Comment from '../Comment/Comment';

import classes from './CommentsModal.module.css';

const CommentsModal: React.FC = () => {
    const [showAddComment, setShowAddComment] = useState(false);

    const addCommentClickHandler = () => {
        setShowAddComment(true)
    }

    return (
        <section className={classes.comments}>
            <h3 className={classes['comments-title']}>Comments</h3>
            <article className={classes['comments-score']}>
                <h4 className={classes['comments-score-title']}>Average score:</h4>
                <div><FontAwesomeIcon icon={['fas', 'star']} className={classes['comments-score-icon']} />4.5 from 30 comments</div>
            </article>
            {!showAddComment && <button onClick={addCommentClickHandler} className={classes['comments-btn']}>Add comment</button>}
            {showAddComment && <div>Add comment form</div>}
            <ul className={classes['comments-list']}>
                <li className={classes['comments-list-item']}>
                    <Comment />
                </li>
                <li className={classes['comments-list-item']}>
                    <Comment />
                </li>
                <li className={classes['comments-list-item']}>
                    <Comment />
                </li>
                <li className={classes['comments-list-item']}>
                    <Comment />
                </li>
                <li className={classes['comments-list-item']}>
                    <Comment />
                </li>
                <li className={classes['comments-list-item']}>
                    <Comment />
                </li>
                <li className={classes['comments-list-item']}>
                    <Comment />
                </li>
            </ul>
        </section>
    );
};

export default CommentsModal;