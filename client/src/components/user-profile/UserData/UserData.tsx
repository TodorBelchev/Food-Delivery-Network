import React, { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { authActions } from '../../../store/auth';
import useHttp from '../../../hooks/use-http';
import useInput from '../../../hooks/use-input';
import IAuthState from '../../../interfaces/IAuthState';
import validators from '../../../validators';


import classes from './UserData.module.css';

type UserDataProps = JSX.IntrinsicElements['section'] & {
    edit: boolean;
}

const UserData: React.FC<UserDataProps> = ({ edit }) => {
    const [isEditMode, setIsEditMode] = useState(edit);
    const user = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const { isLoading, error, sendRequest } = useHttp();
    const {
        value: firstNameValue,
        hasError: firstNameHasError,
        isValid: firstNameIsValid,
        inputBlurHandler: firstNameBlurHandler,
        valueChangeHandler: firstNameChangeHandler,
        setValue: setFirstNameValue,
        reset: firstNameReset
    } = useInput(validators.minLength.bind(null, 4));
    const {
        value: lastNameValue,
        hasError: lastNameHasError,
        isValid: lastNameIsValid,
        inputBlurHandler: lastNameBlurHandler,
        valueChangeHandler: lastNameChangeHandler,
        setValue: setLastNameValue,
        reset: lastNameReset
    } = useInput(validators.minLength.bind(null, 4));
    const {
        value: emailValue,
        hasError: emailHasError,
        isValid: emailIsValid,
        inputBlurHandler: emailBlurHandler,
        valueChangeHandler: emailChangeHandler,
        setValue: setEmailValue,
        reset: emailReset
    } = useInput(validators.isEmail);
    const {
        value: phoneValue,
        hasError: phoneHasError,
        isValid: phoneIsValid,
        inputBlurHandler: phoneBlurHandler,
        valueChangeHandler: phoneChangeHandler,
        setValue: setPhoneValue,
        reset: phoneReset
    } = useInput(validators.isPhone);
    const {
        value: cityValue,
        hasError: cityHasError,
        isValid: cityIsValid,
        inputBlurHandler: cityBlurHandler,
        valueChangeHandler: cityChangeHandler,
        setValue: setCityValue,
        reset: cityReset
    } = useInput(validators.minLength.bind(null, 4));
    const {
        value: addressValue,
        hasError: addressHasError,
        isValid: addressIsValid,
        inputBlurHandler: addressBlurHandler,
        valueChangeHandler: addressChangeHandler,
        setValue: setAddressValue,
        reset: addressReset
    } = useInput(validators.minLength.bind(null, 4));

    const fillForm = useCallback(() => {
        setFirstNameValue(user.firstName || '');
        setLastNameValue(user.lastName || '');
        setEmailValue(user.email || '');
        setPhoneValue(user.phone?.toString() || '');
        setCityValue(user.city || '');
        setAddressValue(user.address || '');
    }, [setFirstNameValue, setLastNameValue, setEmailValue, setPhoneValue, setCityValue, setAddressValue, user]);

    useEffect(() => {
        fillForm();
    }, [fillForm]);


    const editClickHandler = () => {
        setIsEditMode(true);
    }

    const cancelClickHandler = () => {
        setIsEditMode(false);
        firstNameReset();
        lastNameReset();
        phoneReset();
        emailReset();
        cityReset();
        addressReset();
        fillForm();
    }

    const processResponse = (e: IAuthState) => {
        dispatch(authActions.login(e));
        setIsEditMode(false);
        // show OK notification
    }

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formIsValid) { return; }

        const userData = {
            firstName: firstNameValue,
            lastName: lastNameValue,
            email: emailValue,
            phone: phoneValue,
            city: cityValue,
            address: addressValue
        }

        sendRequest({
            url: 'http://localhost:3030/api/user/' + user._id,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }, processResponse);
    }

    const formIsValid = firstNameIsValid && lastNameIsValid && emailIsValid && phoneIsValid && cityIsValid && addressIsValid;

    return (
        <section className={`${classes['create-restaurant']} container`}>
            <h2>{(user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : user.email}`s profile</h2>
            {error && <div>{error}</div>}
            <form className={classes['create-restaurant-form']} onSubmit={submitHandler}>
                <div className={classes.col}>
                    <input
                        className={`${classes['create-restaurant-form-input']} ${firstNameHasError ? classes['input--invalid'] : ''}`}
                        type="text"
                        placeholder=" "
                        name="first-name"
                        disabled={isLoading || !isEditMode}
                        value={firstNameValue}
                        onChange={firstNameChangeHandler}
                        onBlur={firstNameBlurHandler}
                    />
                    <span className={classes.placeholder}>First name</span>
                    {firstNameHasError && <p className={classes['input-notification']}>First name must be at least 4 characters long!</p>}
                </div>
                <div className={classes.col}>
                    <input
                        className={`${classes['create-restaurant-form-input']} ${lastNameHasError ? classes['input--invalid'] : ''}`}
                        type="text"
                        placeholder=" "
                        name="last-name"
                        disabled={isLoading || !isEditMode}
                        value={lastNameValue}
                        onChange={lastNameChangeHandler}
                        onBlur={lastNameBlurHandler}
                    />
                    <span className={classes.placeholder}>Last name</span>
                    {lastNameHasError && <p className={classes['input-notification']}>Last name must be at least 4 characters long!</p>}
                </div>
                <div className={classes.col}>
                    <input
                        className={`${classes['create-restaurant-form-input']} ${emailHasError ? classes['input--invalid'] : ''}`}
                        type="email"
                        placeholder=" "
                        name="email"
                        disabled={isLoading || !isEditMode}
                        value={emailValue}
                        onChange={emailChangeHandler}
                        onBlur={emailBlurHandler}
                    />
                    <span className={classes.placeholder}>Email</span>
                    {emailHasError && <p className={classes['input-notification']}>Please enter a valid email!</p>}
                </div>
                <div className={classes.col}>
                    <input
                        className={`${classes['create-restaurant-form-input']} ${phoneHasError ? classes['input--invalid'] : ''}`}
                        type="tel"
                        placeholder=" "
                        name="phone"
                        disabled={isLoading || !isEditMode}
                        value={phoneValue}
                        onChange={phoneChangeHandler}
                        onBlur={phoneBlurHandler}
                    />
                    <span className={classes.placeholder}>Phone number</span>
                    {phoneHasError && <p className={classes['input-notification']}>Please enter a valid phone number!</p>}
                </div>
                <div className={classes.col}>
                    <input
                        className={`${classes['create-restaurant-form-input']} ${cityHasError ? classes['input--invalid'] : ''}`}
                        type="text"
                        placeholder=" "
                        name="city"
                        disabled={isLoading || !isEditMode}
                        value={cityValue}
                        onChange={cityChangeHandler}
                        onBlur={cityBlurHandler}
                    />
                    <span className={classes.placeholder}>City</span>
                    {cityHasError && <p className={classes['input-notification']}>City must be at least 4 characters long!</p>}
                </div>
                <div className={classes.col}>
                    <input
                        className={`${classes['create-restaurant-form-input']} ${addressHasError ? classes['input--invalid'] : ''}`}
                        type="text"
                        placeholder=" "
                        name="address"
                        disabled={isLoading || !isEditMode}
                        value={addressValue}
                        onChange={addressChangeHandler}
                        onBlur={addressBlurHandler}
                    />
                    <span className={classes.placeholder}>Address</span>
                    {addressHasError && <p className={classes['input-notification']}>Address must be at least 4 characters long!</p>}
                </div>
                {!isEditMode && <button className={`main-btn create-btn ${classes['btn-container-btn']}`} onClick={editClickHandler}>Edit</button>}
                {isEditMode && <div className={classes['btn-container']}>
                    <button
                        className={`main-btn ${classes['btn-container-btn']}`}
                        onClick={editClickHandler}
                        disabled={!formIsValid}
                    >
                        Save
                    </button>
                    <button
                        className={`main-btn ${classes['btn-container-btn']} ${classes['btn-container-btn--cancel']}`}
                        onClick={cancelClickHandler}
                    >
                        Cancel
                    </button>
                </div>}
            </form>
        </section>
    );
};

export default UserData;