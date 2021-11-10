import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { modalActions } from '../../../store/modal';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';

import classes from './Navigation.module.css';
import UserIcon from '../../user-profile/UserIcon/UserIcon';
import Modal from '../../UI/Modal/Modal';
import LoginModal from '../../auth/Login/LoginModal';
import RegisterModal from '../../auth/Register/RegisterModal';

const Navigation: React.FC = () => {
    const modalState = useAppSelector(state => state.modal);
    const user = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    const onLoginClick = () => {
        dispatch(modalActions.open('login'));
    };

    const documentWidth = document.documentElement.clientWidth;
    const windowWidth = window.innerWidth;
    const scrollBarWidth = windowWidth - documentWidth;

    useEffect(() => {
        if (modalState.isOpen) {
            document.body.style.overflowY = 'hidden';
            document.body.style.width = `calc(100% - ${scrollBarWidth}px)`;
        }
        return () => {
            document.body.style.overflowY = 'scroll';
            document.body.style.width = '100%';
        };
    }, [modalState.isOpen, scrollBarWidth]);


    return (
        <header className={classes.header}>
            {modalState.isOpen &&
                modalState.overlayName === 'login' &&
                <Modal>
                    <LoginModal />
                </Modal>
            }
            {modalState.isOpen &&
                modalState.overlayName === 'register' &&
                <Modal>
                    <RegisterModal />
                </Modal>
            }
            <div className={classes.container}>
                <NavLink to="/" className={classes['logo-link']}>
                    <img className={classes.icon} src="/icons/utensils-solid.svg" alt=" utensils" />
                    <h2>Food Delivery Network</h2>
                </NavLink>
                <nav>
                    <ul className={classes['nav-list']}>
                        <li className={classes['nav-list-item']}>
                            {user.email ?
                                <UserIcon /> :
                                <img className={classes['user-icon']} src="/icons/user-icon.svg" alt="user icon" onClick={onLoginClick} />
                            }
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Navigation;