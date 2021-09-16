import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import Modal from '../../UI/Modal';
import LoginModal from '../auth/LoginModal';
import classes from './Navigation.module.css';

const Navigation: React.FC = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const onLoginClick = () => {
        setModalIsOpen(oldState => {
            return !oldState;
        });
    };

    const onBackdropClick = () => {
        setModalIsOpen(false);
    }

    const documentWidth = document.documentElement.clientWidth;
    const windowWidth = window.innerWidth;
    const scrollBarWidth = windowWidth - documentWidth;

    useEffect(() => {
        if (modalIsOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, [modalIsOpen, scrollBarWidth]);


    return (
        <header className={classes.header}>
            {modalIsOpen && <Modal onBackdropClick={onBackdropClick} overlay={LoginModal}></Modal>}
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