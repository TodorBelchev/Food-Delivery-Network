import { FormEvent } from 'react';

import { authActions } from '../../../store/auth';
import { modalActions } from '../../../store/modal';
import { useAppDispatch } from '../../../hooks/redux-hooks';
import useHttp from '../../../hooks/use-http';
import useInput from '../../../hooks/use-input';
import validators from '../../../validators';
import IUser from '../../../interfaces/IUser';

import classes from './RegisterModal.module.css';

const RegisterModal: React.FC = () => {
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
    const {
        value: rePasswordValue,
        isValid: rePasswordIsValid,
        hasError: rePasswordHasError,
        valueChangeHandler: rePasswordChangeHandler,
        inputBlurHandler: rePasswordBlurHandler,
        reset: resetRePassword
    } = useInput(validators.stringMatch.bind(null, passwordValue));

    let formIsValid = false;

    if (emailIsValid && passwordIsValid && rePasswordIsValid && passwordValue === rePasswordValue) {
        formIsValid = true;
    }

    const processResponse = (response: IUser) => {
        resetEmail();
        resetPassword();
        resetRePassword();
        dispatch(modalActions.close());
        dispatch(authActions.login(response));
    };

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();

        if (!formIsValid) { return; }

        sendRequest({
            url: 'http://localhost:3030/api/user/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                email: emailValue,
                password: passwordValue,
                rePassword: rePasswordValue
            }
        }, processResponse);
    }

    const switchToLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(modalActions.changeOverlay('login'));
    }

    return (
        <section className={classes.register}>
            {error && <div>{error}<button onClick={closeError}>Close error</button></div>}
            {isLoading && <div>Loading...</div>}
            <form className={classes['register-form']} onSubmit={submitHandler}>
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
                <label htmlFor="re-password">Repeat password:</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    name="re-password"
                    id="re-password"
                    value={rePasswordValue}
                    onChange={rePasswordChangeHandler}
                    onBlur={rePasswordBlurHandler}
                />
                {rePasswordHasError && <p>Passwords must match</p>}
                <button className="main-btn">register</button>
            </form>
            <p>You already have registration?</p>
            <a href="/login" onClick={switchToLogin}>Click here to login</a>
        </section>
    );
}

export default RegisterModal;