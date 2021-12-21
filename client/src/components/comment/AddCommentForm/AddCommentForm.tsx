import React, { useCallback, useEffect } from 'react';

import { useAppSelector } from '../../../hooks/reduxHooks';
import useHttp from '../../../hooks/useHttp';
import useUserInput from '../../../hooks/useUserInput';
import IComment from '../../../interfaces/IComment';
import IRestaurant from '../../../interfaces/IRestaurant';
import restaurantOptions from '../../../utils/restaurantOptions';
import validators from '../../../validators';

import Spinner from '../../UI/Spinner/Spinner';


import classes from './AddCommentForm.module.css';

type AddCommentFormProps = JSX.IntrinsicElements['form'] & {
    setFormIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    cancelClickHandler: () => void;
    addCommentSubmitHandler: (res: { comments: IComment[], restaurant: IRestaurant }) => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ cancelClickHandler, addCommentSubmitHandler, setFormIsLoading }) => {
    const user = useAppSelector(state => state.auth);
    const { isLoading, setError, sendRequest } = useHttp();
    const restaurant = useAppSelector(state => state.restaurant);
    const {
        value: nameValue,
        hasError: nameHasError,
        isValid: nameIsValid,
        valueChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
        setValue: setNameValue
    } = useUserInput(validators.minLength.bind(null, 6));
    const {
        value: commentValue,
        hasError: commentHasError,
        isValid: commentIsValid,
        valueChangeHandler: commentChangeHandler,
        inputBlurHandler: commentBlurHandler
    } = useUserInput(validators.minLength.bind(null, 10));

    const formIsValid = nameIsValid && commentIsValid;

    useEffect(() => {
        if (user.firstName && user.lastName) {
            setNameValue(`${user.firstName} ${user.lastName}`);
        }
    }, [setNameValue, user]);

    const processResponse = useCallback((res: { comments: IComment[], restaurant: IRestaurant }) => {
        addCommentSubmitHandler(res);
        setFormIsLoading(false);
    }, [addCommentSubmitHandler, setFormIsLoading]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const rating = formData.get('rating');

        if (rating === null) {
            setError('Rating is required!');
            return;
        }

        if (!formIsValid) { return; }

        setFormIsLoading(true);
        sendRequest(restaurantOptions.addComment(restaurant._id, nameValue, commentValue, rating as string), processResponse);
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
                        disabled={isLoading}
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
                            <input type="radio" name="rating" value="1" />
                            <span className={classes.icon}>&#9733;</span>
                        </label>
                        <label>
                            <input type="radio" name="rating" value="2" />
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                        </label>
                        <label>
                            <input type="radio" name="rating" value="3" />
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                        </label>
                        <label>
                            <input type="radio" name="rating" value="4" />
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                        </label>
                        <label>
                            <input data-testid="rating" type="radio" name="rating" value="5" />
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                            <span className={classes.icon}>&#9733;</span>
                        </label>
                    </div>
                    <div className={classes['controls-btns']}>
                        <button className={classes['controls-btn']} disabled={!formIsValid || isLoading}>Add</button>
                        <button onClick={cancelClickHandler} className={`${classes['controls-btn']} ${classes['controls-btn--danger']}`} type="button">Cancel</button>
                    </div>
                </div>
            </form>}
        </>
    );
};

export default AddCommentForm;