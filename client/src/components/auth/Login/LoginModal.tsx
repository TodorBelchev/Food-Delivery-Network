import { FormEvent } from 'react';

import { authActions } from '../../../store/auth';
import { modalActions } from '../../../store/modal';
import { useAppDispatch } from '../../../hooks/redux-hooks';
import useHttp from '../../../hooks/use-http';
import useInput from '../../../hooks/use-input';
import validators from '../../../validators';
import IUser from '../../../interfaces/IUser';
import Spinner from '../../UI/Spinner/Spinner';

import classes from './LoginModal.module.css';


const LoginModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, error, closeError, sendRequest } = useHttp();
    const {
        value: emailValue,
        isValid: emailIsValid,
        hasError: emailHasError,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        reset: resetEmail
    } = useInput(validators.isEmail);
    const {
        value: passwordValue,
        isValid: passwordIsValid,
        hasError: passwordHasError,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        reset: resetPassword
    } = useInput(validators.minLength);

    let formIsValid = false;

    if (emailIsValid && passwordIsValid) {
        formIsValid = true;
    }

    const processResponse = (response: IUser) => {
        resetEmail();
        resetPassword();
        dispatch(modalActions.close());
        dispatch(authActions.login(response));
    }

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();

        if (!formIsValid) { return; }

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
        }, processResponse);

        resetEmail();
        resetPassword();
    }

    const switchToRegister = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(modalActions.changeOverlay('register'));
    }

    return (
        <section className={classes.login}>
            <h3 className={classes['login-title']}>Sign in into Food Delivery Network</h3>
            {isLoading && <Spinner />}
            {error && <div>{error}<button onClick={closeError}>Close error</button></div>}
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
            <a href="/register" onClick={switchToRegister}>Click here to register</a>
        </section>
    );
};

export default LoginModal;