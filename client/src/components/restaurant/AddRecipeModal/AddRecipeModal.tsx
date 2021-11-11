import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch } from '../../../hooks/redux-hooks';
import { modalActions } from '../../../store/modal';
import useHttp from '../../../hooks/use-http';
import useInput from '../../../hooks/use-input';
import validators from '../../../validators';

import classes from './AddRecipeModal.module.css';

type AddRecipeModalProps = JSX.IntrinsicElements['section'] & {
    _id: string;
    categories: string[];
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ _id, categories }) => {
    const { isLoading, error, sendRequest } = useHttp();
    const dispatch = useAppDispatch();
    const {
        value: nameValue,
        hasError: nameHasError,
        isValid: nameIsValid,
        inputBlurHandler: nameBlurHandler,
        valueChangeHandler: nameChangeHandler
    } = useInput(validators.minLength.bind(null, 6));
    const {
        value: ingredientsValue,
        hasError: ingredientsHasError,
        isValid: ingredientsIsValid,
        inputBlurHandler: ingredientsBlurHandler,
        valueChangeHandler: ingredientsChangeHandler
    } = useInput(validators.minStringCount.bind(null, 3));
    const {
        value: priceValue,
        hasError: priceHasError,
        isValid: priceIsValid,
        inputBlurHandler: priceBlurHandler,
        valueChangeHandler: priceChangeHandler
    } = useInput(validators.minLength.bind(null, 1));
    const {
        value: categoryValue,
        isValid: categoryIsValid,
        inputBlurHandler: categoryBlurHandler,
        valueChangeHandler: categoryChangeHandler
    } = useInput(validators.minLength.bind(null, 1));

    let formIsValid = nameIsValid && ingredientsIsValid && priceIsValid && categoryIsValid;

    const processResponse = () => {
        // show OK notification
        dispatch(modalActions.close());
    }

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formIsValid) { return; }

        const recipeData = {
            name: nameValue,
            ingredients: ingredientsValue,
            price: priceValue,
            category: categoryValue
        }

        sendRequest({
            url: 'http://localhost:3030/api/recipe/' + _id + '/add-recipe',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recipeData)
        }, processResponse)
    }
    return (
        <section className={`${classes['add-recipe']} container`}>
            <h2>Add recipe</h2>
            {error && <div>{error}</div>}
            <form className={classes['create-restaurant-form']} onSubmit={submitHandler}>
                <div className={classes.col}>
                    <input
                        className={`${classes['create-restaurant-form-input']} ${nameHasError ? classes['input--invalid'] : ''}`}
                        type="text"
                        placeholder=" "
                        name="name"
                        disabled={isLoading}
                        value={nameValue}
                        onChange={nameChangeHandler}
                        onBlur={nameBlurHandler}
                    />
                    <span className={classes.placeholder}>Recipe name</span>
                    {nameHasError && <p className={classes['input-notification']}>Recipe name must be at least 6 characters long!</p>}
                </div>
                <div className={classes.col}>
                    <input
                        className={`${classes['create-restaurant-form-input']} ${nameHasError ? classes['input--invalid'] : ''}`}
                        type="text"
                        placeholder=" "
                        name="name"
                        disabled={isLoading}
                        value={ingredientsValue}
                        onChange={ingredientsChangeHandler}
                        onBlur={ingredientsBlurHandler}
                    />
                    <span className={classes.placeholder}>Ingredients separated by ","</span>
                    {ingredientsHasError && <p className={classes['input-notification']}>At least 3 ingredients are required!</p>}
                </div>
                <div className={classes.col}>
                    <input
                        className={`${classes['create-restaurant-form-input']} ${nameHasError ? classes['input--invalid'] : ''}`}
                        type="number"
                        placeholder=" "
                        name="name"
                        disabled={isLoading}
                        value={priceValue}
                        onChange={priceChangeHandler}
                        onBlur={priceBlurHandler}
                    />
                    <span className={classes.placeholder}>Price</span>
                    {priceHasError && <p className={classes['input-notification']}>Price is required!</p>}
                </div>
                <div className={classes.col}>
                    <select
                        className={classes.select}
                        value={categoryValue}
                        disabled={isLoading}
                        onChange={categoryChangeHandler}
                        onBlur={categoryBlurHandler}
                    >
                        <option>Select category</option>
                        {categories.map(x => <option key={uuidv4()}>{x}</option>)}
                    </select>
                </div>
                <button className="main-btn create-btn">Add</button>
            </form>
        </section>
    )
};

export default AddRecipeModal;