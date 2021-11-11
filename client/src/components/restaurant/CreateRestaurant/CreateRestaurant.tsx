import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import MultiChoiceSelect, { InputStringType } from '../../UI/MultiChoiceSelect/MultiChoiceSelect';
import useHttp from '../../../hooks/use-http';
import useInput from '../../../hooks/use-input';
import validators from '../../../validators';
import IRestaurant from '../../../interfaces/IRestaurant';

import classes from './CreateRestaurant.module.css';

type CreateRestaurantProps = JSX.IntrinsicElements['section'] & {
    edit: boolean;
    restaurant?: IRestaurant;
    setRestaurant?: Dispatch<SetStateAction<IRestaurant | null>>;
}

const CreateRestaurant: React.FC<CreateRestaurantProps> = ({ edit, restaurant, setRestaurant }) => {
    const cities = [
        { name: 'Sofia', _id: 0 },
        { name: 'Varna', _id: 1 },
        { name: 'Burgas', _id: 2 },
        { name: 'Plovdiv', _id: 3 },
        { name: 'Shumen', _id: 4 },
        { name: 'Stara Zagora', _id: 5 },
        { name: 'Blagoevgrad', _id: 6 },
    ]
    const [selectedCities, setSelectedCities] = useState<InputStringType[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [fileIsValid, setFileIsValid] = useState(true);
    const { isLoading, error, sendRequest } = useHttp();
    const history = useHistory();
    const {
        value: nameValue,
        isValid: nameIsValid,
        hasError: nameHasError,
        valueChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
        reset: nameReset,
        setValue: setNameValue
    } = useInput(validators.minLength.bind(null, 6));
    const {
        value: mainThemeValue,
        isValid: mainThemeIsValid,
        hasError: mainThemeHasError,
        valueChangeHandler: mainThemeChangeHandler,
        inputBlurHandler: mainThemeBlurHandler,
        reset: mainThemeReset,
        setValue: setMainThemeValue
    } = useInput(validators.minLength.bind(null, 6));
    const {
        value: categoriesValue,
        isValid: categoriesIsValid,
        hasError: categoriesHasError,
        valueChangeHandler: categoriesChangeHandler,
        inputBlurHandler: categoriesBlurHandler,
        reset: categoriesReset,
        setValue: setCategoriesValue
    } = useInput(validators.categoriesCount);
    const {
        value: workTimeValue,
        isValid: workTimeIsValid,
        hasError: workTimeHasError,
        valueChangeHandler: workTimeChangeHandler,
        inputBlurHandler: workTimeBlurHandler,
        reset: workTimeReset,
        setValue: setWorkTimeValue
    } = useInput(validators.workTime);

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
            setRestaurant!(response);
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

        let url = 'http://localhost:3030/api/restaurant/create';
        let method = 'POST';
        if (edit) {
            url = `http://localhost:3030/api/restaurant/${restaurant?._id}`;
            method = 'PUT';
        }

        sendRequest({
            url,
            method,
            body: formData
        }, processResponse);

    };

    return (
        <section className={`${classes['create-restaurant']} container`}>
            {!edit && <h2>Lets create together the best restaurant</h2>}
            {edit && <h2>Edit restaurant</h2>}
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
                    {categoriesHasError && <p className={classes['input-notification']}>At least 3 categories are required!</p>}
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
                    />
                </div>
                <button className="main-btn create-btn">{edit ? 'Edit' : 'Create'}</button>
            </form>
        </section>
    )
};

export default CreateRestaurant;