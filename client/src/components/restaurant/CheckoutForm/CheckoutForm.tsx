import React, { useState } from 'react';

import useInput from '../../../hooks/use-input';
import validators from '../../../validators';
import Spinner from '../../UI/Spinner/Spinner';


import classes from './CheckoutForm.module.css';

const CheckoutForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const {
        value: addressValue,
        hasError: addressHasError,
        valueChangeHandler: addressChangeHandler,
        inputBlurHandler: addressBlurHandler
    } = useInput(validators.minLength.bind(null, 6));
    const {
        value: cityValue,
        hasError: cityHasError,
        valueChangeHandler: cityChangeHandler,
        inputBlurHandler: cityBlurHandler
    } = useInput(validators.minLength.bind(null, 6));
    const {
        value: nameValue,
        hasError: nameHasError,
        valueChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler
    } = useInput(validators.minLength.bind(null, 6));
    const {
        value: phoneValue,
        hasError: phoneHasError,
        valueChangeHandler: phoneChangeHandler,
        inputBlurHandler: phoneBlurHandler
    } = useInput(validators.isPhone);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // send request
    }

    const formIsValid = !addressHasError && !cityHasError && !nameHasError && !phoneHasError;

    return (
        <form onSubmit={submitHandler} className={classes.form}>
            <h2 className={classes['form-title']}>Checkout</h2>
            <div className={classes.col}>
                <input
                    className={addressHasError ? classes['input-invalid'] : ''}
                    placeholder=" "
                    type="text"
                    name="address"
                    id="address"
                    disabled={isLoading}
                    value={addressValue}
                    onChange={addressChangeHandler}
                    onBlur={addressBlurHandler}
                />
                <span className={classes.placeholder}>Address</span>
                {addressHasError && <p className={classes['input-notification']}>Address must be at least 6 characters long!</p>}
            </div>
            <div className={classes.col}>
                <input
                    className={cityHasError ? classes['input-invalid'] : ''}
                    placeholder=" "
                    type="text"
                    name="city"
                    id="city"
                    disabled={isLoading}
                    value={cityValue}
                    onChange={cityChangeHandler}
                    onBlur={cityBlurHandler}
                />
                <span className={classes.placeholder}>City</span>
                {cityHasError && <p className={classes['input-notification']}>City must be at least 6 characters long!</p>}
            </div>
            <div className={classes.col}>
                <input
                    className={nameHasError ? classes['input-invalid'] : ''}
                    placeholder=" "
                    type="text"
                    name="name"
                    id="name"
                    disabled={isLoading}
                    value={nameValue}
                    onChange={nameChangeHandler}
                    onBlur={nameBlurHandler}
                />
                <span className={classes.placeholder}>First and last name</span>
                {nameHasError && <p className={classes['input-notification']}>Names must be at least 6 characters long!</p>}
            </div>
            <div className={classes.col}>
                <input
                    className={phoneHasError ? classes['input-invalid'] : ''}
                    placeholder=" "
                    type="tel"
                    name="phone"
                    id="phone"
                    disabled={isLoading}
                    value={phoneValue}
                    onChange={phoneChangeHandler}
                    onBlur={phoneBlurHandler}
                />
                <span className={classes.placeholder}>Phone number</span>
                {phoneHasError && <p className={classes['input-notification']}>Please enter a valid phone number!</p>}
            </div>
            <button
                className={`main-btn ${classes['main-btn']}`}
                disabled={!formIsValid || isLoading}
            >
                Order
                {isLoading && <span className={classes['spinner-container']}><Spinner size="small" /></span>}
            </button>
        </form>
    )
}

export default CheckoutForm;