import React, { Dispatch, SetStateAction } from 'react';

import { useAppSelector } from '../../../hooks/redux-hooks';
import useHttp from '../../../hooks/use-http';
import useInput from '../../../hooks/use-input';
import IComment from '../../../interfaces/IComment';
import validators from '../../../validators';


import classes from './AddCommentForm.module.css';

type AddCommentFormProps = JSX.IntrinsicElements['form'] & {
    setShowAddComment: Dispatch<SetStateAction<boolean>>
    setComments: Dispatch<SetStateAction<IComment[]>>
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ setShowAddComment, setComments }) => {
    const { isLoading, setError, error, sendRequest } = useHttp();
    const restaurant = useAppSelector(state => state.restaurant);
    const {
        value: nameValue,
        hasError: nameHasError,
        valueChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler
    } = useInput(validators.minLength.bind(null, 6));
    const {
        value: commentValue,
        hasError: commentHasError,
        valueChangeHandler: commentChangeHandler,
        inputBlurHandler: commentBlurHandler
    } = useInput(validators.minLength.bind(null, 10));

    const formIsValid = !nameHasError && !commentHasError;

    const cancelClickHandler = () => setShowAddComment(false);

    const processResponse = (res: IComment[]) => {
        setComments(res);
        setShowAddComment(false);
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

        sendRequest({
            url: `http://localhost:3030/api/restaurant/${restaurant._id}/comment`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: nameValue, comment: commentValue, rating })
        }, processResponse);
    }

    return (
        <form className={classes.form} onSubmit={submitHandler}>
            {error && <div className={classes.error}>{error}</div>}
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
                <label htmlFor="name" className={classes.placeholder}>Name: ex.John Doe</label>
                {nameHasError && <p className={classes['input-notification']}>Name must be at least 6 characters long!</p>}
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
                <label htmlFor="comment" className={classes.placeholder}>Leave comment here...</label>
                {commentHasError && <p className={classes['input-notification']}>Comment must be at least 10 characters long!</p>}
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
                        <input type="radio" name="rating" value="5" />
                        <span className={classes.icon}>&#9733;</span>
                        <span className={classes.icon}>&#9733;</span>
                        <span className={classes.icon}>&#9733;</span>
                        <span className={classes.icon}>&#9733;</span>
                        <span className={classes.icon}>&#9733;</span>
                    </label>
                </div>
                <div>
                    <button className={classes['controls-btn']}>Add</button>
                    <button onClick={cancelClickHandler} className={`${classes['controls-btn']} ${classes['controls-btn--danger']}`}>Cancel</button>
                </div>
            </div>
        </form>
    );
};

export default AddCommentForm;