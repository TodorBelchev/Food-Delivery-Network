import React, { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { cartActions } from '../../../store/cart';
import { checkoutActions } from '../../../store/checkout';
import { notificationActions } from '../../../store/notification';
import useHttp from '../../../hooks/useHttp';
import useUserInput from '../../../hooks/useUserInput';
import IRecipe from '../../../interfaces/IRecipe';
import validators from '../../../validators';
import orderOptions from '../../../utils/orderOptions';
import isOpen from '../../../utils/isOpen';

import Spinner from '../../UI/Spinner/Spinner';


import classes from './CheckoutForm.module.css';

type CheckoutFormProps = JSX.IntrinsicElements['form'] & {
    cartRecipes: { recipe: IRecipe; quantity: number; }[];
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartRecipes }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth);
    const restaurant = useAppSelector(state => state.restaurant);
    const checkoutState = useAppSelector(state => state.checkout);
    const { isLoading, sendRequest } = useHttp();
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

    const nameRef = useRef<null | string>(null);
    const addressRef = useRef<null | string>(null);
    const cityRef = useRef<null | string>(null);
    const phoneRef = useRef<null | string>(null);
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

        const restaurantIsOpen = isOpen(restaurant.workHours);

        if (!restaurantIsOpen) {
            dispatch(notificationActions.show({ type: 'error', text: `Unable to checkout. Restaurant working hours: ${restaurant.workHours.join('-')}` }))
            return;
        }

        const hasCity = restaurant.cities.some(x => x.name.toLocaleLowerCase() === cityValue.toLocaleLowerCase());

        if (!hasCity) {
            const citiesString = restaurant.cities.map(x => x.name).join(', ');
            dispatch(notificationActions.show({ type: 'error', text: `Unable to checkout. Restaurant delivers in these cities: ${citiesString}.` }));
            return;
        }

        const processResponse = () => {
            nameRef.current = null;
            addressRef.current = null;
            cityRef.current = null;
            phoneRef.current = null;
            dispatch(cartActions.clearCartOrder({ restaurantId: restaurant._id }));
            dispatch(notificationActions.show({ type: 'success', text: 'Successful order!'}));
            setTimeout(() => {
                dispatch(notificationActions.close());
            }, 3000);
        }

        const orderData = {
            address: addressValue,
            city: cityValue,
            name: nameValue,
            phone: phoneValue,
            recipes: cartRecipes.map(x => {
                return { recipe: x.recipe._id, quantity: x.quantity }
            }),
            restaurant: restaurant._id
        }

        sendRequest(orderOptions.add(orderData), processResponse);
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