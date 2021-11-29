import React, { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { cartActions } from '../../../store/cart';
import { checkoutActions } from '../../../store/checkout';
import useHttp from '../../../hooks/useHttp';
import useUserInput from '../../../hooks/useUserInput';
import IRecipe from '../../../interfaces/IRecipe';
import validators from '../../../validators';

import Spinner from '../../UI/Spinner/Spinner';


import classes from './CheckoutForm.module.css';

type CheckoutFormProps = JSX.IntrinsicElements['form'] & {
    cartRecipes: { recipe: IRecipe; quantity: number; }[];
    restaurantId: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartRecipes, restaurantId }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth);
    const checkoutState = useAppSelector(state => state.checkout);
    const { isLoading, sendRequest, error } = useHttp();
    const {
        value: addressValue,
        hasError: addressHasError,
        valueChangeHandler: addressChangeHandler,
        inputBlurHandler: addressBlurHandler,
        isValid: addressIsValid,
        setValue: setAddressValue
    } = useUserInput(validators.minLength.bind(null, 6));
    const {
        value: cityValue,
        hasError: cityHasError,
        valueChangeHandler: cityChangeHandler,
        inputBlurHandler: cityBlurHandler,
        isValid: cityIsValid,
        setValue: setCityValue
    } = useUserInput(validators.minLength.bind(null, 4));
    const {
        value: nameValue,
        hasError: nameHasError,
        valueChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
        isValid: nameIsValid,
        setValue: setNameValue
    } = useUserInput(validators.minLength.bind(null, 6));
    const {
        value: phoneValue,
        hasError: phoneHasError,
        valueChangeHandler: phoneChangeHandler,
        inputBlurHandler: phoneBlurHandler,
        isValid: phoneIsValid,
        setValue: setPhoneValue
    } = useUserInput(validators.isPhone);

    const nameRef = useRef('');
    const addressRef = useRef('');
    const cityRef = useRef('');
    const phoneRef = useRef('');
    nameRef.current = nameValue;
    addressRef.current = addressValue;
    cityRef.current = cityValue;
    phoneRef.current = phoneValue;

    useEffect(() => {
        setAddressValue(checkoutState.address || user.address || '');
        setCityValue(checkoutState.city || user.city || '');
        setPhoneValue(checkoutState.phone?.toString() || user.phone?.toString() || '');
        if (user.firstName && user.lastName) {
            setNameValue(checkoutState.name || `${user.firstName} ${user.lastName}`);
        } else {
            setNameValue(checkoutState.name || '');
        }
        return () => {
            dispatch(checkoutActions.save({ name: nameRef.current, phone: phoneRef.current, city: cityRef.current, address: addressRef.current }));
        }
    }, [
        setAddressValue,
        setCityValue,
        setPhoneValue,
        setNameValue,
        user,
        checkoutState,
        dispatch
    ]);

    const formIsValid = addressIsValid && cityIsValid && nameIsValid && phoneIsValid;

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formIsValid) { return; }

        const processResponse = () => {
            dispatch(cartActions.clearCartOrder({ restaurantId }));
            // show OK notification
        }

        const orderData = {
            address: addressValue,
            city: cityValue,
            name: nameValue,
            phone: phoneValue,
            recipes: cartRecipes.map(x => {
                return { recipe: x.recipe._id, quantity: x.quantity }
            }),
            restaurant: restaurantId
        }

        sendRequest({
            url: 'http://localhost:3030/api/order',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        }, processResponse);
    }


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
                {cityHasError && <p className={classes['input-notification']}>City must be at least 4 characters long!</p>}
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
            {error && <div className={classes.error}>{error}</div>}
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