import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import IComment from '../../../interfaces/IComment';

import AddCommentForm from '../AddCommentForm/AddCommentForm';
import Comment from '../Comment/Comment';

import classes from './CommentsModal.module.css';
import useHttp from '../../../hooks/use-http';
import { useAppSelector } from '../../../hooks/redux-hooks';

const CommentsModal: React.FC = () => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [showAddComment, setShowAddComment] = useState(false);
    const { sendRequest } = useHttp();
    const restaurant = useAppSelector(state => state.restaurant);
    const user = useAppSelector(state => state.auth);

    useEffect(() => {
        sendRequest({
            url: `http://localhost:3030/api/restaurant/${restaurant._id}/comment`
        }, (res: IComment[]) => setComments(res));
    }, [sendRequest, restaurant]);

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
            {!showAddComment && user.email && <button onClick={addCommentClickHandler} className={classes['comments-btn']}>Add comment</button>}
            {showAddComment && <AddCommentForm setShowAddComment={setShowAddComment} setComments={setComments} />}
            <ul className={classes['comments-list']}>
                {comments.map(x => {
                    return (
                        <li key={x._id} className={classes['comments-list-item']}>
                            <Comment commentObj={x} />
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default CommentsModal;