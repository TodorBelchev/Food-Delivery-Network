import { FormEvent, useState } from 'react';

import { authActions } from '../../../store/auth';
import { modalActions } from '../../../store/modal';
import { useAppDispatch } from '../../../hooks/redux-hooks';
import useHttp from '../../../hooks/use-http';
import useInput from '../../../hooks/use-input';
import validators from '../../../validators';

import classes from './RegisterModal.module.css';
import Spinner from '../../UI/Spinner/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IAuthState from '../../../interfaces/IAuthState';

const RegisterModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, error, sendRequest } = useHttp();
    const [passwordIsHidden, setPasswordIsHidden] = useState(true);
    const [rePasswordIsHidden, setRePasswordIsHidden] = useState(true);
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
    } = useInput(validators.minLength.bind(null, 6));
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

    const processResponse = (response: IAuthState) => {
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
            body: JSON.stringify({
                email: emailValue,
                password: passwordValue,
                rePassword: rePasswordValue
            })
        }, processResponse);
    }

    const switchToLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(modalActions.changeOverlay('login'));
    }

    const togglePasswordVisibility = () => {
        setPasswordIsHidden(oldState => !oldState);
    };

    const toggleRePasswordVisibility = () => {
        setRePasswordIsHidden(oldState => !oldState);
    };

    return (
        <section className={classes.register}>
            <h3 className={classes['register-title']}>Sign up into Food Delivery Network</h3>
            <form className={classes['register-form']} onSubmit={submitHandler}>
                <div className={classes.col}>
                    <label htmlFor="email">
                        <FontAwesomeIcon icon={['far', 'envelope']} className={classes['icon']} />
                    </label>
                    <input
                        className={emailHasError ? classes['input-invalid'] : ''}
                        type="email"
                        placeholder=" "
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
                        type={passwordIsHidden ? 'password' : 'text'}
                        placeholder=" "
                        name="password"
                        id="password"
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
                <div className={classes.col}>
                    <label htmlFor="re-password">
                        <FontAwesomeIcon icon={['fas', 'unlock-alt']} className={classes['icon']} />
                    </label>
                    <input
                        className={rePasswordHasError ? classes['input-invalid'] : ''}
                        type={rePasswordIsHidden ? 'password' : 'text'}
                        placeholder=" "
                        name="re-password"
                        id="re-password"
                        value={rePasswordValue}
                        onChange={rePasswordChangeHandler}
                        onBlur={rePasswordBlurHandler}
                    />
                    {rePasswordIsHidden
                        ? <FontAwesomeIcon icon={['far', 'eye-slash']} className={`${classes['icon']} ${classes['eye']}`} onClick={toggleRePasswordVisibility} />
                        : <FontAwesomeIcon icon={['far', 'eye']} className={`${classes['icon']} ${classes['eye']}`} onClick={toggleRePasswordVisibility} />
                    }
                    <span className={classes.placeholder}>Repeat password</span>
                    {rePasswordHasError && <p className={classes['input-notification']}>Passwords must match</p>}
                </div>
                {error && <div className={classes.error}>{error}</div>}
                <button className={`main-btn ${classes['main-btn']}`} disabled={!formIsValid || isLoading}>Sign up{isLoading && <span className={classes['spinner-container']}><Spinner size="small" /></span>}</button>
                <p className={classes.invite}>You already have registration? <a href="/login" onClick={switchToLogin}>Sign in now!</a></p>
            </form>
        </section>
    );
}

export default RegisterModal;