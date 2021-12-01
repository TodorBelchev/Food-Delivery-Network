import { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import IComment from '../../../interfaces/IComment';
import useHttp from '../../../hooks/useHttp';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { restaurantActions } from '../../../store/restaurant';
import IAddCommentResponse from '../../../interfaces/IAddCommentResponse';

import AddCommentForm from '../AddCommentForm/AddCommentForm';
import Comment from '../Comment/Comment';
import Spinner from '../../UI/Spinner/Spinner';


import classes from './CommentsModal.module.css';

const CommentsModal: React.FC = () => {
    const [comments, setComments] = useState<(IComment | null)[]>([]);
    const [totalCommentsCount, setTotalCommentsCount] = useState(0);
    const [page, setPage] = useState(1);
    const [showAddComment, setShowAddComment] = useState(false);
    const [formIsLoading, setFormIsLoading] = useState(false);
    const restaurant = useAppSelector(state => state.restaurant);
    const user = useAppSelector(state => state.auth);
    const { sendRequest, isLoading } = useHttp();
    const dispatch = useAppDispatch();
    const resId = restaurant._id;

    const processResponse = useCallback((res: IAddCommentResponse) => {
        setComments(oldState => oldState.concat(res.comments));
        setTotalCommentsCount(res.ratingsCount);
    }, [setComments]);

    useEffect(() => {
        if (page === 0) { return; }
        sendRequest({ url: `http://localhost:3030/api/restaurant/${resId}/comment?page=${page}` }, processResponse)
    }, [resId, page, processResponse, sendRequest]);

    const observer = useRef<IntersectionObserver>();
    const lastCommentElementRef = useCallback(node => {
        if (isLoading || formIsLoading) { return; }
        if (observer.current) { observer.current.disconnect(); }
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && totalCommentsCount > comments.length) {
                setPage(oldPage => oldPage + 1)
            }
        });
        if (node) { observer.current.observe(node); }
    }, [isLoading, totalCommentsCount, comments, formIsLoading]);

    const addCommentClickHandler = () => setShowAddComment(true);

    const cancelClickHandler = () => setShowAddComment(false);

    const addCommentSubmitHandler = useCallback((res: IAddCommentResponse) => {
        setShowAddComment(false);
        setComments([]);
        setPage(0);
        setPage(1);
        setTotalCommentsCount(res.ratingsCount);
        dispatch(restaurantActions.setRestaurant({ ...restaurant, rating: res.rating, ratingsCount: res.ratingsCount }));
    }, [dispatch, restaurant]);

    const editCommentHandler = (comment: IComment) => {
        const newComments = comments.map(x => {
            if (x?._id === comment._id) { return comment; }
            return x;
        });
        setComments(newComments);
    };

    const deleteCommentHandler = (res: { rating: number; ratingsCount: number; commentId: string }) => {
        let newComments = comments.map(x => {
            if (x?._id === res.commentId) { return null; }
            return x;
        });
        if (res.ratingsCount <= 10 && comments.length >= 10) {
            newComments = [];
            setPage(0);
            setPage(1);
        }
        setComments(newComments);
        dispatch(restaurantActions.setRestaurant({ ...restaurant, rating: res.rating, ratingsCount: res.ratingsCount }));
    };

    return (
        <section className={classes.comments}>
            <h3 className={classes['comments-title']}>Comments</h3>
            <article className={classes['comments-score']}>
                <h4 className={classes['comments-score-title']}>Average score:</h4>
                <div>
                    <FontAwesomeIcon
                        icon={['fas', 'star']}
                        className={restaurant.rating !== 0 ? classes['comments-score-icon'] : classes['comments-score-icon--gray']}
                    />
                    {restaurant.rating !== 0 && <span>{restaurant.rating} from {restaurant.ratingsCount} comments</span>}
                    {restaurant.rating === 0 && <span>No comments yet!</span>}
                </div>
            </article>
            {!showAddComment && user.email && <button onClick={addCommentClickHandler} className={classes['comments-btn']}>Add comment</button>}
            {showAddComment && <AddCommentForm cancelClickHandler={cancelClickHandler} setFormIsLoading={setFormIsLoading} addCommentSubmitHandler={addCommentSubmitHandler} />}
            <ul className={classes['comments-list']}>
                {comments.map((x, i) => {
                    if (x === null) { return null };
                    if (comments.length === i + 1) {
                        return (
                            <li ref={lastCommentElementRef} key={x?._id} className={classes['comments-list-item']}>
                                <Comment commentObj={x} editCommentHandler={editCommentHandler} deleteCommentHandler={deleteCommentHandler} />
                            </li>
                        )
                    } else {
                        return (
                            <li key={x._id} className={classes['comments-list-item']}>
                                <Comment commentObj={x} editCommentHandler={editCommentHandler} deleteCommentHandler={deleteCommentHandler} />
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