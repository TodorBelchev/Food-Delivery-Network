import { FormEvent, useEffect, useState } from 'react';

import { authActions } from '../../../store/auth';
import { modalActions } from '../../../store/modal';
import { notificationActions } from '../../../store/notification';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import useHttp from '../../../hooks/useHttp';
import useUserInput from '../../../hooks/useUserInput';
import validators from '../../../validators';
import IAuthState from '../../../interfaces/IAuthState';
import userOptions from '../../../utils/userOptions';

import Spinner from '../../UI/Spinner/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import classes from './RegisterModal.module.css';

const RegisterModal: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isLoading, sendRequest } = useHttp();
    const [passwordIsHidden, setPasswordIsHidden] = useState(true);
    const [rePasswordIsHidden, setRePasswordIsHidden] = useState(true);
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
    const {
        value: rePasswordValue,
        isValid: rePasswordIsValid,
        hasError: rePasswordHasError,
        valueChangeHandler: rePasswordChangeHandler,
        inputBlurHandler: rePasswordBlurHandler,
        reset: resetRePassword
    } = useUserInput(validators.stringMatch.bind(null, passwordValue));

    useEffect(() => {
        return () => {
            dispatch(notificationActions.close());
        }
    }, [dispatch]);

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

        sendRequest(userOptions.register(emailValue, passwordValue, rePasswordValue), processResponse);
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
                        data-testid="email"
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
                        data-testid="password"
                        value={passwordValue}
                        onChange={passwordChangeHandler}
                        onBlur={passwordBlurHandler}
                    />
                    {passwordIsHidden
                        ? <FontAwesomeIcon data-testid="show-password" icon={['far', 'eye-slash']} className={`${classes['icon']} ${classes['eye']}`} onClick={togglePasswordVisibility} />
                        : <FontAwesomeIcon icon={['far', 'eye']} className={`${classes['icon']} ${classes['eye']}`} onClick={togglePasswordVisibility} />
                    }
                    <span className={classes.placeholder}>Password</span>
                    {passwordHasError && <p className={classes['input-notification']}>At least 6 characters</p>}
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
                        data-testid="re-password"
                        value={rePasswordValue}
                        onChange={rePasswordChangeHandler}
                        onBlur={rePasswordBlurHandler}
                    />
                    {rePasswordIsHidden
                        ? <FontAwesomeIcon data-testid="show-re-password" icon={['far', 'eye-slash']} className={`${classes['icon']} ${classes['eye']}`} onClick={toggleRePasswordVisibility} />
                        : <FontAwesomeIcon icon={['far', 'eye']} className={`${classes['icon']} ${classes['eye']}`} onClick={toggleRePasswordVisibility} />
                    }
                    <span className={classes.placeholder}>Re-password</span>
                    {rePasswordHasError && <p className={classes['input-notification']}>Passwords must match</p>}
                </div>
                <button
                    className={`main-btn ${classes['main-btn']}`}
                    disabled={!formIsValid || isLoading}
                >
                    Sign up
                    {isLoading && <span className={classes['spinner-container']}><Spinner size="small" /></span>}
                </button>
                <p className={classes.invite}>You already have registration? <a href="/login" onClick={switchToLogin}>Sign in now!</a></p>
            </form>
        </section>
    );
}

export default RegisterModal;