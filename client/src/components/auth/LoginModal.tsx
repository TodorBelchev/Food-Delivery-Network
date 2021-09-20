import React, { FormEvent } from 'react';
import { authActions } from '../../store/auth';

import { useAppDispatch } from '../../hooks/redux-hooks';
import useHttp from '../../hooks/use-http';

import classes from './LoginModal.module.css';
import { ILoginModalProps } from '../../interfaces/ILoginModal';

const LoginModal: React.FC<ILoginModalProps> = (props) => {
    const dispatch = useAppDispatch();
    const { isLoading, error, closeError, sendRequest } = useHttp();

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();

        sendRequest({
            url: 'http://localhost:3030/api/user/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                email: 'pesho@abv.bg',
                password: '123456'
            }
        }, () => {
            if (props.onBackdropClick) {
                props.onBackdropClick();
            }
            dispatch(authActions.login());
        });
    }




    return (
        <section className={classes.login}>
            {error && <div>{error}<button onClick={closeError}>Close error</button></div>}
            {isLoading && <div>Loading...</div>}
            <form className={classes['login-form']} onSubmit={submitHandler}>
                <label htmlFor="username">Username:</label>
                <input type="text" placeholder="Enter your username" name="username" />
                <label htmlFor="password">Password:</label>
                <input type="password" placeholder="Enter your password" name="password" />
                <button className="main-btn">Login</button>
            </form>
            <p>You don't have registration?</p>
            <a href="/register">Click here to register</a>
        </section>
    );
};

export default LoginModal;