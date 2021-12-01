import React, { Dispatch, SetStateAction, useEffect } from 'react';

import { useAppSelector } from '../../../hooks/reduxHooks';
import useHttp from '../../../hooks/useHttp';
import useUserInput from '../../../hooks/useUserInput';
import IComment from '../../../interfaces/IComment';
import validators from '../../../validators';


import classes from './EditCommentForm.module.css';

type EditCommentFormProps = JSX.IntrinsicElements['form'] & {
    comment: IComment;
    setIsEditMode: Dispatch<SetStateAction<boolean>>;
    editCommentHandler: (comment: IComment) => void;
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

    const processResponse = (res: IComment) => {
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

        sendRequest({
            url: `http://localhost:3030/api/restaurant/${restaurant._id}/comment/${comment._id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: nameValue, comment: commentValue, rating })
        }, processResponse);
    }

    return (
        <form className={classes.form} onSubmit={submitHandler}>
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
                <div>
                    <button className={classes['controls-btn']}>Edit</button>
                    <button onClick={cancelClickHandler} className={`${classes['controls-btn']} ${classes['controls-btn--danger']}`} type="button">Cancel</button>
                </div>
            </div>
        </form>
    );
};

export default EditCommentForm;