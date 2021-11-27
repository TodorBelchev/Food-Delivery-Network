import { FormEvent, useState } from 'react';

import { authActions } from '../../../store/auth';
import { modalActions } from '../../../store/modal';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import useHttp from '../../../hooks/useHttp';
import useUserInput from '../../../hooks/useUserInput';
import validators from '../../../validators';
import Spinner from '../../UI/Spinner/Spinner';

import classes from './LoginModal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IAuthState from '../../../interfaces/IAuthState';


const LoginModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, error, sendRequest } = useHttp();
    const [passwordIsHidden, setPasswordIsHidden] = useState(true);
    const {
        value: emailValue,
        isValid: emailIsValid,
        hasError: emailHasError,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
        reset: resetEmail
    } = useUserInput(validators.isEmail);
    const {
        value: passwordValue,
        isValid: passwordIsValid,
        hasError: passwordHasError,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        reset: resetPassword
    } = useUserInput(validators.minLength.bind(null, 6));

    let formIsValid = false;

    if (emailIsValid && passwordIsValid) {
        formIsValid = true;
    }

    const processResponse = (response: IAuthState) => {
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
            body: JSON.stringify({
                email: emailValue,
                password: passwordValue
            })
        }, processResponse);
    }

    const switchToRegister = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(modalActions.changeOverlay('register'));
    }

    const togglePasswordVisibility = () => {
        setPasswordIsHidden(oldState => !oldState);
    };

    return (
        <section className={classes.login}>
            <h3 className={classes['login-title']}>Sign in into Food Delivery Network</h3>
            <form className={classes['login-form']} onSubmit={submitHandler}>
                <div className={classes.col}>
                    <label htmlFor="email">
                        <FontAwesomeIcon icon={['far', 'envelope']} className={classes['icon']} />
                    </label>
                    <input
                        className={emailHasError ? classes['input-invalid'] : ''}
                        placeholder=" "
                        type="email"
                        name="email"
                        id="email"
                        disabled={isLoading}
                        value={emailValue}
                        onChange={emailChangeHandler}
                        onBlur={emailBlurHandler}
                    />
                    <span className={classes.placeholder}>Email</span>
                    {emailHasError && <p className={classes['input-notification']}>Please enter a valid email</p>}
                </div>
                <div className={classes.col}>
                    <label htmlFor="password">
                        <FontAwesomeIcon icon={['fas', 'unlock-alt']} className={classes['icon']} />
                    </label>
                    <input
                        className={passwordHasError ? classes['input-invalid'] : ''}
                        placeholder=" "
                        type={passwordIsHidden ? 'password' : 'text'}
                        name="password"
                        id="password"
                        disabled={isLoading}
                        value={passwordValue}
                        onChange={passwordChangeHandler}
                        onBlur={passwordBlurHandler}
                    />
                    {passwordIsHidden
                        ? <FontAwesomeIcon icon={['far', 'eye-slash']} className={`${classes['icon']} ${classes['eye']}`} onClick={togglePasswordVisibility} />
                        : <FontAwesomeIcon icon={['far', 'eye']} className={`${classes['icon']} ${classes['eye']}`} onClick={togglePasswordVisibility} />
                    }
                    <span className={classes.placeholder}>Password</span>
                    {passwordHasError && <p className={classes['input-notification']}>Password must be at least 6 characters</p>}
                </div>
                {error && <div className={classes.error}>{error}</div>}
                <button className={`main-btn ${classes['main-btn']}`} disabled={!formIsValid || isLoading}>Sign in{isLoading && <span className={classes['spinner-container']}><Spinner size="small" /></span>}</button>
                <p className={classes.invite}>You don't have registration? <a href="/register" onClick={switchToRegister}>Sign up now!</a></p>
            </form>
        </section>
    );
};

export default LoginModal;