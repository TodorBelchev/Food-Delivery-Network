import { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import IComment from '../../../interfaces/IComment';
import useHttp from '../../../hooks/use-http';
import { useAppSelector } from '../../../hooks/redux-hooks';

import AddCommentForm from '../AddCommentForm/AddCommentForm';
import Comment from '../Comment/Comment';
import Spinner from '../../UI/Spinner/Spinner';


import classes from './CommentsModal.module.css';

const CommentsModal: React.FC = () => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [totalCommentsCount, setTotalCommentsCount] = useState(0);
    const [page, setPage] = useState(1);
    const restaurant = useAppSelector(state => state.restaurant);
    const user = useAppSelector(state => state.auth);
    const [showAddComment, setShowAddComment] = useState(false);
    const { sendRequest, isLoading } = useHttp();

    const processResponse = useCallback((res: { comments: IComment[], commentsCount: number }) => {
        setComments(oldState => oldState.concat(res.comments));
        setTotalCommentsCount(res.commentsCount);
    }, [setComments]);

    useEffect(() => {
        sendRequest({ url: `http://localhost:3030/api/restaurant/${restaurant._id}/comment?page=${page}` }, processResponse)
    }, [restaurant, page, processResponse, sendRequest]);

    const observer = useRef<IntersectionObserver>();
    const lastCommentElementRef = useCallback(node => {
        if (isLoading) { return; }
        if (observer.current) { observer.current.disconnect(); }
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && totalCommentsCount > comments.length) {
                setPage(oldPage => oldPage + 1)
            }
        });
        if (node) { observer.current.observe(node); }
    }, [isLoading, totalCommentsCount, comments]);

    const addCommentClickHandler = () => setShowAddComment(true);

    const editCommentHandler = (comment: IComment) => {
        const newComments = comments.map(x => {
            if (x._id === comment._id) { return comment; }
            return x;
        });
        setComments(newComments);
    };

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
                {comments.map((x, i) => {
                    if (comments.length === i + 1) {
                        return (
                            <li ref={lastCommentElementRef} key={x._id} className={classes['comments-list-item']}>
                                <Comment commentObj={x} editCommentHandler={editCommentHandler} />
                            </li>
                        )
                    } else {
                        return (
                            <li key={x._id} className={classes['comments-list-item']}>
                                <Comment commentObj={x} editCommentHandler={editCommentHandler} />
                            </li>
                        );
                    }
                })}
                {isLoading && <Spinner />}
            </ul>
        </section>
    );
};

export default CommentsModal;