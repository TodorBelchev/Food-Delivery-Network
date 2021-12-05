import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import useHttp from '../../../hooks/useHttp';
import useUserInput from '../../../hooks/useUserInput';
import validators from '../../../validators';
import IRestaurant from '../../../interfaces/IRestaurant';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { restaurantActions } from '../../../store/restaurant';
import getCities from '../../../utils/getCities';

import MultiChoiceSelect, { InputStringType } from '../../UI/MultiChoiceSelect/MultiChoiceSelect';
import Spinner from '../../UI/Spinner/Spinner';

import classes from './CreateRestaurant.module.css';
import restaurantOptions from '../../../utils/restaurantOptions';

type CreateRestaurantProps = JSX.IntrinsicElements['section'] & {
    edit: boolean;
}

const CreateRestaurant: React.FC<CreateRestaurantProps> = ({ edit }) => {
    const dispatch = useAppDispatch();
    const restaurant = useAppSelector(state => state.restaurant);
    const cities = getCities();
    const [selectedCities, setSelectedCities] = useState<InputStringType[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [fileIsValid, setFileIsValid] = useState(true);
    const { isLoading, sendRequest } = useHttp();
    const history = useHistory();
    const {
        value: nameValue,
        isValid: nameIsValid,
        hasError: nameHasError,
        valueChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
        reset: nameReset,
        setValue: setNameValue
    } = useUserInput(validators.minLength.bind(null, 6));
    const {
        value: mainThemeValue,
        isValid: mainThemeIsValid,
        hasError: mainThemeHasError,
        valueChangeHandler: mainThemeChangeHandler,
        inputBlurHandler: mainThemeBlurHandler,
        reset: mainThemeReset,
        setValue: setMainThemeValue
    } = useUserInput(validators.minLength.bind(null, 6));
    const {
        value: categoriesValue,
        isValid: categoriesIsValid,
        hasError: categoriesHasError,
        valueChangeHandler: categoriesChangeHandler,
        inputBlurHandler: categoriesBlurHandler,
        reset: categoriesReset,
        setValue: setCategoriesValue
    } = useUserInput(validators.minStringCount.bind(null, 1));
    const {
        value: workTimeValue,
        isValid: workTimeIsValid,
        hasError: workTimeHasError,
        valueChangeHandler: workTimeChangeHandler,
        inputBlurHandler: workTimeBlurHandler,
        reset: workTimeReset,
        setValue: setWorkTimeValue
    } = useUserInput(validators.workTime);

    useEffect(() => {
        if (edit) {
            setNameValue(restaurant!.name);
            setMainThemeValue(restaurant!.mainTheme);
            setCategoriesValue(restaurant!.categories.join(','));
            setWorkTimeValue(`${restaurant!.workDays.join('-')} ${restaurant!.workHours.join('-')}`);
            setSelectedCities(restaurant!.cities);
        }
    }, [edit, restaurant, setNameValue, setMainThemeValue, setCategoriesValue, setWorkTimeValue]);

    let formIsValid = false;

    if (nameIsValid && mainThemeIsValid && categoriesIsValid && workTimeIsValid && fileIsValid) {
        formIsValid = true;
    }

    const processResponse = (response: IRestaurant) => {
        nameReset();
        mainThemeReset();
        categoriesReset();
        workTimeReset();
        if (edit) {
            dispatch(restaurantActions.setRestaurant(response));
        }
        history.replace(`/restaurant/${response._id}`);
    };

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile && !edit) {
            setFileIsValid(false);
            return;
        }

        if (!formIsValid) { return; }

        const formData = new FormData();
        if (selectedFile) {
            formData.append('Restaurant Cover', selectedFile!, selectedFile!.name);
        } else {
            formData.append('Restaurant Cover', JSON.stringify(restaurant!.image));
        }
        formData.append('name', nameValue);
        formData.append('mainTheme', mainThemeValue);
        formData.append('categories', categoriesValue);
        formData.append('workTime', workTimeValue);
        formData.append('cities', JSON.stringify(selectedCities));

        let options = restaurantOptions.add(formData);
        if (edit) {
            options = restaurantOptions.edit(restaurant._id, formData);
        }

        sendRequest(options, processResponse);

    };

    return (
        <section className={`${classes['create-restaurant']} container`}>
            {!edit && <h2>Lets create together the best restaurant</h2>}
            {edit && <h2>Edit restaurant</h2>}
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
                    <span className={classes.placeholder}>Name of the restaurant</span>
                    {nameHasError && <p className={classes['input-notification']}>Name must be at least 6 characters long!</p>}
                </div>
                <div className={classes.col}>
                    <input
                        className={`${classes['create-restaurant-form-input']} ${mainThemeHasError ? classes['input--invalid'] : ''}`}
                        type="text"
                        placeholder=" "
                        name="theme"
                        disabled={isLoading}
                        value={mainThemeValue}
                        onChange={mainThemeChangeHandler}
                        onBlur={mainThemeBlurHandler}
                    />
                    <span className={classes.placeholder}>Main theme of the restaurant</span>
                    {mainThemeHasError && <p className={classes['input-notification']}>Main theme must be at least 6 characters long!</p>}
                </div>
                <div className={classes.col}>
                    <input
                        className={`${classes['create-restaurant-form-input']} ${categoriesHasError ? classes['input--invalid'] : ''}`}
                        type="text"
                        placeholder=" "
                        name="categories"
                        disabled={isLoading}
                        value={categoriesValue}
                        onChange={categoriesChangeHandler}
                        onBlur={categoriesBlurHandler}
                    />
                    <span className={classes.placeholder}>Categories separated by ","</span>
                    {categoriesHasError && <p className={classes['input-notification']}>At least 1 category is required!</p>}
                </div>
                <div className={classes.col}>
                    <input
                        className={`${classes['create-restaurant-form-input']} ${workTimeHasError ? classes['input--invalid'] : ''}`}
                        type="text"
                        placeholder=" "
                        name="work-time"
                        disabled={isLoading}
                        value={workTimeValue}
                        onChange={workTimeChangeHandler}
                        onBlur={workTimeBlurHandler}
                    />
                    <span className={classes.placeholder}>Monday-Friday 10:00-20:00</span>
                    {workTimeHasError && <p className={classes['input-notification']}>Please fill working time in the correct format!</p>}
                </div>
                <div className={classes.col}>
                    <label className={`${classes['file-label']} ${!fileIsValid ? classes['file-label--invalid'] : ''}`} htmlFor="image">
                        {selectedFile ? 'File selected' : 'Upload restaurant cover image'}
                    </label>
                    <input
                        className={classes['file-btn']}
                        id="image"
                        type="file"
                        disabled={isLoading}
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
                <div className={classes.col}>
                    <MultiChoiceSelect
                        text={'Select cities'}
                        inputStrings={cities}
                        setStateHandler={setSelectedCities}
                        selected={selectedCities}
                        disabled={isLoading}
                    />
                </div>
                <button
                    className={`main-btn create-btn ${classes['create-restaurant-btn']}`}
                    disabled={!formIsValid || isLoading}
                >
                    {edit ? 'Edit' : 'Create'}
                    {isLoading && <span className={classes['spinner-container']}><Spinner size="small" /></span>}
                </button>
            </form>
        </section>
    )
};

export default CreateRestaurant;