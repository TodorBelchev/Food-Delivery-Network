import { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import IComment from '../../../interfaces/IComment';
import useHttp from '../../../hooks/useHttp';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { restaurantActions } from '../../../store/restaurant';
import ICommentsResponse from '../../../interfaces/ICommentsResponse';
import IRestaurant from '../../../interfaces/IRestaurant';
import { authActions } from '../../../store/auth';
import restaurantOptions from '../../../utils/restaurantOptions';

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

    const processResponse = useCallback((res: ICommentsResponse) => {
        setComments(oldState => oldState.concat(res.comments));
        setTotalCommentsCount(res.ratingsCount);
        if (res.tokenExpired) {
            dispatch(authActions.logout());
        }
    }, [setComments, dispatch]);

    useEffect(() => {
        if (page === 0) { return; }
        sendRequest(restaurantOptions.getComments(resId, page), processResponse);
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

    const addCommentSubmitHandler = useCallback((res: { comments: IComment[], restaurant: IRestaurant }) => {
        setShowAddComment(false);
        setComments([]);
        setPage(0);
        setPage(1);
        setTotalCommentsCount(res.comments.length);
        dispatch(restaurantActions.updateRating({ rating: res.restaurant.rating, ratingsCount: res.restaurant.ratingsCount }));
    }, [dispatch]);

    const editCommentHandler = (res: { comment: IComment, restaurant: IRestaurant }) => {
        const newComments = comments.map(x => {
            if (x?._id === res.comment._id) { return res.comment; }
            return x;
        });
        setComments(newComments);
        dispatch(restaurantActions.updateRating({ rating: res.restaurant.rating, ratingsCount: res.restaurant.ratingsCount }));
    };

    const deleteCommentHandler = (res: { restaurant: IRestaurant; commentId: string }) => {
        let newComments = comments.map(x => {
            if (x?._id === res.commentId) { return null; }
            return x;
        });
        if (res.restaurant.ratingsCount <= 10 && comments.length >= 10) {
            newComments = [];
            setPage(0);
            setPage(1);
        }
        setComments(newComments);
        dispatch(restaurantActions.updateRating({ rating: res.restaurant.rating, ratingsCount: res.restaurant.ratingsCount }));
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
                {isLoading && <Spinner size="medium" />}
            </ul>
        </section>
    );
};

export default CommentsModal;