import React, { FormEvent } from 'react';

import { authActions } from '../../store/auth';
import { useAppDispatch } from '../../hooks/redux-hooks';
import useHttp from '../../hooks/use-http';
import useInput from '../../hooks/use-input';

import classes from './LoginModal.module.css';
import { ILoginModalProps } from '../../interfaces/ILoginModal';


const isEmail = (value: string) => value.includes('@');
const minLength = (value: string) => value.length >= 6;

const LoginModal: React.FC<ILoginModalProps> = (props) => {
    const {
        value: emailValue,
        isValid: emailIsValid,
        hasError: emailHasError,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        reset: resetEmail
    } = useInput(isEmail);
    const {
        value: passwordValue,
        isValid: passwordIsValid,
        hasError: passwordHasError,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        reset: resetPassword
    } = useInput(minLength);
    const dispatch = useAppDispatch();
    const { isLoading, error, closeError, sendRequest } = useHttp();

    let formIsValid = false;

    if (emailIsValid && passwordIsValid) {
        formIsValid = true;
    }

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();

        if (!formIsValid) {
            return;
        }

        sendRequest({
            url: 'http://localhost:3030/api/user/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                email: emailValue,
                password: passwordValue
            }
        }, () => {
            props.onBackdropClick!();
            dispatch(authActions.login());
        });

        resetEmail();
        resetPassword();
    }

    return (
        <section className={classes.login}>
            {error && <div>{error}<button onClick={closeError}>Close error</button></div>}
            {isLoading && <div>Loading...</div>}
            <form className={classes['login-form']} onSubmit={submitHandler}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    id="email"
                    value={emailValue}
                    onChange={emailChangeHandler}
                    onBlur={emailBlurHandler}
                />
                {emailHasError && <p>Please enter a valid email</p>}
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    id="password"
                    value={passwordValue}
                    onChange={passwordChangeHandler}
                    onBlur={passwordBlurHandler}
                />
                {passwordHasError && <p>Password must be at least 6 characters</p>}
                <button className="main-btn" disabled={!formIsValid}>Login</button>
            </form>
            <p>You don't have registration?</p>
            <a href="/register">Click here to register</a>
        </section>
    );
};

export default LoginModal;