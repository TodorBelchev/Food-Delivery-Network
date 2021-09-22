import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { modalActions } from '../../store/modal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';

import Modal from '../../UI/Modal';
import classes from './Navigation.module.css';

const Navigation: React.FC = () => {
    const modalIsOpen = useAppSelector(state => state.modal.isOpen);
    const dispatch = useAppDispatch();

    const onLoginClick = () => {
        dispatch(modalActions.open('login'));
    };

    const documentWidth = document.documentElement.clientWidth;
    const windowWidth = window.innerWidth;
    const scrollBarWidth = windowWidth - documentWidth;

    useEffect(() => {
        if (modalIsOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.width = `calc(100% - ${scrollBarWidth}px)`;
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.width = '100%';
        };
    }, [modalIsOpen, scrollBarWidth]);


    return (
        <header className={classes.header}>
            {modalIsOpen && <Modal />}
            <div className={classes.container}>
                <NavLink to="/" className={classes['logo-link']}>
                    <img className={classes.icon} src="/images/utensils-solid.svg" alt=" utensils" />
                    <h2>Food Delivery Network</h2>
                </NavLink>
                <nav>
                    <ul className={classes['nav-list']}>
                        <li className={classes['nav-list-item']}>
                            <button onClick={onLoginClick} className="login-link">Login</button>
                        </li>
                        <li className={classes['nav-list-item']}>
                            <NavLink to="/register" className="register-link">Register</NavLink>
                        </li>
                        <li className={classes['nav-list-item']}>
                            <NavLink to="#">
                                <img className={classes.icon} src="/images/shopping-cart-solid.svg" alt="shopping cart" />
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Navigation;