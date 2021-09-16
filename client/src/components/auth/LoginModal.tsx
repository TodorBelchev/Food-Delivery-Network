import React from 'react';

import classes from './LoginModal.module.css';

const LoginModal: React.FC = () => {
    return (
        <div className={classes.modal}>
            <section className={classes.login}>
                <form className={classes['login-form']}>
                    <label htmlFor="username">Username:</label>
                    <input type="text" placeholder="Enter your username" name="username" />
                    <label htmlFor="password">Password:</label>
                    <input type="password" placeholder="Enter your password" name="password" />
                    <button className="main-btn">Login</button>
                </form>
                <p>You don't have registration?</p>
                <a href="/register">Click here to register</a>
            </section>
        </div>
    );
};

export default LoginModal;