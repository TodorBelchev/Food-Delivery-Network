import React, { ChangeEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { modalActions } from '../../../store/modal';
import { restaurantActions } from '../../../store/restaurant';
import useHttp from '../../../hooks/useHttp';
import useUserInput from '../../../hooks/useUserInput';
import validators from '../../../validators';
import IRestaurant from '../../../interfaces/IRestaurant';
import IRecipe from '../../../interfaces/IRecipe';
import recipeOptions from '../../../utils/recipeOptions';

import Spinner from '../../UI/Spinner/Spinner';


import classes from './AddRecipeModal.module.css';

type AddRecipeModalProps = JSX.IntrinsicElements['section'] & {
    recipe?: IRecipe;
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ recipe }) => {
    const restaurant = useAppSelector(state => state.restaurant);
    const dispatch = useAppDispatch();
    const { isLoading, sendRequest } = useHttp();
    const [selectedFile, setSelectedFile] = useState<File>();
    const [fileIsValid, setFileIsValid] = useState(true);
    const {
        value: nameValue,
        hasError: nameHasError,
        isValid: nameIsValid,
        inputBlurHandler: nameBlurHandler,
        valueChangeHandler: nameChangeHandler,
        setValue: setNameValue
    } = useUserInput(validators.minLength.bind(null, 5));
    const {
        value: ingredientsValue,
        hasError: ingredientsHasError,
        isValid: ingredientsIsValid,
        inputBlurHandler: ingredientsBlurHandler,
        valueChangeHandler: ingredientsChangeHandler,
        setValue: setIngredientsValue
    } = useUserInput(validators.minStringCount.bind(null, 3));
    const {
        value: priceValue,
        hasError: priceHasError,
        isValid: priceIsValid,
        inputBlurHandler: priceBlurHandler,
        valueChangeHandler: priceChangeHandler,
        setValue: setPriceValue
    } = useUserInput(validators.minLength.bind(null, 1));
    const {
        value: weightValue,
        hasError: weightHasError,
        isValid: weightIsValid,
        inputBlurHandler: weightBlurHandler,
        valueChangeHandler: weightChangeHandler,
        setValue: setWeightValue
    } = useUserInput(validators.minLength.bind(null, 1));
    const {
        value: categoryValue,
        isValid: categoryIsValid,
        hasError: categoryHasError,
        inputBlurHandler: categoryBlurHandler,
        valueChangeHandler: categoryChangeHandler,
        setValue: setCategoryValue
    } = useUserInput(validators.minLength.bind(null, 1));

    let formIsValid = nameIsValid && ingredientsIsValid && priceIsValid && categoryIsValid && weightIsValid;

    useEffect(() => {
        if (recipe) {
            setNameValue(recipe.name);
            setIngredientsValue(recipe.ingredients.join(','));
            setPriceValue(recipe.price.toString());
            setWeightValue(recipe.weight.toString());
            setCategoryValue(recipe.category);
        }
    }, [recipe, setNameValue, setIngredientsValue, setPriceValue, setWeightValue, setCategoryValue]);

    const fileChangeHandler = (e: ChangeEvent) => {
        const element = e.target as HTMLInputElement;
        if (element.files?.length !== 0) {
            setSelectedFile(element.files![0]);
            setFileIsValid(true);
        }
    }

    const processResponse = (res: IRestaurant) => {
        dispatch(restaurantActions.setRestaurant(res));
        dispatch(modalActions.close());
    }

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile && !recipe) {
            setFileIsValid(false);
            return;
        }

        if (!formIsValid) { return; }

        const formData = new FormData();
        if (selectedFile) {
            formData.append('Recipe image', selectedFile!, selectedFile!.name);
        } else {
            formData.append('Recipe image', JSON.stringify(recipe!.image));
        }
        formData.append('name', nameValue);
        formData.append('ingredients', ingredientsValue);
        formData.append('price', priceValue);
        formData.append('category', categoryValue);
        formData.append('weight', weightValue);

        let options = recipeOptions.add(restaurant._id, formData);

        if (recipe) {
            options = recipeOptions.edit(recipe._id, restaurant._id, formData);
        }

        sendRequest(options, processResponse)
    }
    return (
        <section className={`${classes['add-recipe']} container`}>
            <h2>Add recipe</h2>
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
                    {nameHasError && <p className={classes['input-notification']}>At least 5 characters long!</p>}
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
                    {ingredientsHasError && <p className={classes['input-notification']}>At least 3!</p>}
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
                        disabled={isLoading}
                        onChange={fileChangeHandler}
                    />
                    {!fileIsValid && <p className={classes['input-notification']}>Restaurant cover image is required!</p>}
                </div>
                {!recipe &&
                    <button className={`main-btn create-btn ${classes['btn-flex']}`} disabled={!formIsValid || isLoading}>
                        Add
                        {isLoading && <span className={classes['spinner-container']}><Spinner size="small" /></span>}
                    </button>}
                {recipe &&
                    <button className={`main-btn create-btn ${classes['btn-flex']}`} disabled={!formIsValid || isLoading}>
                        Edit
                        {isLoading && <span className={classes['spinner-container']}><Spinner size="small" /></span>}
                    </button>}

            </form>
        </section>
    )
};

export default AddRecipeModal;