import React, { Dispatch, SetStateAction, useEffect } from 'react';

import { useAppSelector } from '../../../hooks/reduxHooks';
import useHttp from '../../../hooks/useHttp';
import useUserInput from '../../../hooks/useUserInput';
import IComment from '../../../interfaces/IComment';
import IRestaurant from '../../../interfaces/IRestaurant';
import restaurantOptions from '../../../utils/restaurantOptions';
import validators from '../../../validators';

import Spinner from '../../UI/Spinner/Spinner';


import classes from './EditCommentForm.module.css';

type EditCommentFormProps = JSX.IntrinsicElements['form'] & {
    comment: IComment;
    setIsEditMode: Dispatch<SetStateAction<boolean>>;
    editCommentHandler: (res: { comment: IComment, restaurant: IRestaurant }) => void;
}

const EditCommentForm: React.FC<EditCommentFormProps> = ({ comment, setIsEditMode, editCommentHandler }) => {
    const { isLoading, setError, sendRequest } = useHttp();
    const restaurant = useAppSelector(state => state.restaurant);
    const {
        value: nameValue,
        hasError: nameHasError,
        valueChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
        setValue: setNameValue
    } = useUserInput(validators.minLength.bind(null, 6));
    const {
        value: commentValue,
        hasError: commentHasError,
        valueChangeHandler: commentChangeHandler,
        inputBlurHandler: commentBlurHandler,
        setValue: setCommentValue
    } = useUserInput(validators.minLength.bind(null, 10));

    const formIsValid = !nameHasError && !commentHasError;

    useEffect(() => {
        setNameValue(comment.name);
        setCommentValue(comment.comment);
    }, [setNameValue, setCommentValue, comment]);

    const cancelClickHandler = () => {
        setIsEditMode(false);
    };

    const processResponse = (res: { comment: IComment, restaurant: IRestaurant }) => {
        setIsEditMode(false);
        editCommentHandler(res);
    }

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const rating = formData.get('rating');

        if (rating === null) {
            setError('Rating is required!');
            return;
        }

        if (!formIsValid) { return; }

        sendRequest(
            restaurantOptions.editComment(restaurant._id, comment._id, nameValue, commentValue, rating as string),
            processResponse
        );
    }

    return (
        <>
            {isLoading && <div className={classes['background']}><Spinner /></div>}
            {!isLoading && <form className={classes.form} onSubmit={submitHandler}>
                <div className={classes.col}>
                    <input
                        className={nameHasError ? classes['input-invalid'] : ''}
                        placeholder=" "
                        type="name"
                        name="name"
                        id="name"
                        disabled={isLoading}
                        value={nameValue}
                        onChange={nameChangeHandler}
                        onBlur={nameBlurHandler}
                    />
                    <label htmlFor="name" className={classes.placeholder}>Name:</label>
                    {nameHasError && <p className={classes['input-notification']}>At least 6 characters long!</p>}
                </div>
                <div className={classes.col}>
                    <textarea
                        className={classes['textarea']}
                        placeholder=" "
                        name="comment"
                        id="comment"
                        rows={3}
                        value={commentValue}
                        onChange={commentChangeHandler}
                        onBlur={commentBlurHandler}
                    />
                    <label htmlFor="comment" className={classes.placeholder}>Comment:</label>
                    {commentHasError && <p className={classes['input-notification']}>At least 10 characters long!</p>}
                </div>
                <div className={classes.controls}>
                    <div className={classes.rating}>
                        <label>
                            <input type="radio" name="rating" value="1" defaultChecked={comment.rating === 1} />
                            <span className={classes.icon}>&#9733;</span>
                        </label>
                        <label>
                            <input type="radio" name="rating" value="2" defaultChecked={comment.rating === 2} />
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                        </label>
                        <label>
                            <input type="radio" name="rating" value="3" defaultChecked={comment.rating === 3} />
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                        </label>
                        <label>
                            <input type="radio" name="rating" value="4" defaultChecked={comment.rating === 4} />
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                        </label>
                        <label>
                            <input type="radio" name="rating" value="5" defaultChecked={comment.rating === 5} />
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                        </label>
                    </div>
                    <div className={classes['controls-btns']}>
                        <button className={classes['controls-btn']}>Edit</button>
                        <button onClick={cancelClickHandler} className={`${classes['controls-btn']} ${classes['controls-btn--danger']}`} type="button">Cancel</button>
                    </div>
                </div>
            </form>}
        </>
    );
};

export default EditCommentForm;