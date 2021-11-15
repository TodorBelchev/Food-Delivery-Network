import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { modalActions } from '../../../store/modal';
import { restaurantActions } from '../../../store/restaurant';
import useHttp from '../../../hooks/use-http';
import useInput from '../../../hooks/use-input';
import validators from '../../../validators';

import classes from './AddRecipeModal.module.css';
import IRestaurant from '../../../interfaces/IRestaurant';


const AddRecipeModal: React.FC = () => {
    const restaurant = useAppSelector(state => state.restaurant);
    const dispatch = useAppDispatch();
    const { isLoading, error, sendRequest } = useHttp();
    const [selectedFile, setSelectedFile] = useState<File>();
    const [fileIsValid, setFileIsValid] = useState(true);
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
        value: weightValue,
        hasError: weightHasError,
        isValid: weightIsValid,
        inputBlurHandler: weightBlurHandler,
        valueChangeHandler: weightChangeHandler
    } = useInput(validators.minLength.bind(null, 1));
    const {
        value: categoryValue,
        isValid: categoryIsValid,
        hasError: categoryHasError,
        inputBlurHandler: categoryBlurHandler,
        valueChangeHandler: categoryChangeHandler
    } = useInput(validators.minLength.bind(null, 1));

    let formIsValid = nameIsValid && ingredientsIsValid && priceIsValid && categoryIsValid && weightIsValid;

    const processResponse = (res: IRestaurant) => {
        // show OK notification
        dispatch(restaurantActions.setRestaurant(res));
        dispatch(modalActions.close());
    }

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setFileIsValid(false);
            return;
        }

        if (!formIsValid) { return; }

        const formData = new FormData();
        formData.append('Restaurant Cover', selectedFile!, selectedFile!.name);
        formData.append('name', nameValue);
        formData.append('ingredients', ingredientsValue);
        formData.append('price', priceValue);
        formData.append('category', categoryValue);
        formData.append('weight', weightValue);

        sendRequest({
            url: 'http://localhost:3030/api/recipe/' + restaurant._id + '/add-recipe',
            method: 'POST',
            body: formData
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
                        className={`${classes['create-restaurant-form-input']} ${ingredientsHasError ? classes['input--invalid'] : ''}`}
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
                        className={`${classes['create-restaurant-form-input']} ${weightHasError ? classes['input--invalid'] : ''}`}
                        type="number"
                        placeholder=" "
                        name="name"
                        disabled={isLoading}
                        value={weightValue}
                        onChange={weightChangeHandler}
                        onBlur={weightBlurHandler}
                    />
                    <span className={classes.placeholder}>Weight in grams</span>
                    {weightHasError && <p className={classes['input-notification']}>Weight is required!</p>}
                </div>
                <div className={classes.col}>
                    <input
                        className={`${classes['create-restaurant-form-input']} ${priceHasError ? classes['input--invalid'] : ''}`}
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
                        className={`${classes.select} ${categoryHasError ? classes['input--invalid'] : ''}`}
                        value={categoryValue}
                        disabled={isLoading}
                        onChange={categoryChangeHandler}
                        onBlur={categoryBlurHandler}
                    >
                        <option hidden>Select category</option>
                        {restaurant.categories.map(x => <option key={uuidv4()}>{x}</option>)}
                    </select>
                    {categoryHasError && <p className={classes['input-notification']}>Category is required!</p>}
                </div>
                <div className={classes.col}>
                    <label className={`${classes['file-label']} ${!fileIsValid ? classes['file-label--invalid'] : ''}`} htmlFor="image">
                        {selectedFile ? 'File selected' : 'Upload restaurant cover image'}
                    </label>
                    <input
                        className={classes['file-btn']}
                        id="image"
                        type="file"
                        name="image"
                        onChange={(e) => {
                            if (e.target.files?.length !== 0) {
                                setSelectedFile(e.target.files![0]);
                                setFileIsValid(true);
                            }
                        }}
                    />
                    {!fileIsValid && <p className={classes['input-notification']}>Restaurant cover image is required!</p>}
                </div>
                <button className="main-btn create-btn">Add</button>
            </form>
        </section>
    )
};

export default AddRecipeModal;