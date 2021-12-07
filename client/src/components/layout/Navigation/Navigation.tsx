import { NavLink } from 'react-router-dom';

import { modalActions } from '../../../store/modal';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import usePreventScrolling from '../../../hooks/usePreventScrolling';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../UI/Modal/Modal';
import LoginModal from '../../auth/Login/LoginModal';
import RegisterModal from '../../auth/Register/RegisterModal';
import UserIcon from '../../userProfile/UserIcon/UserIcon';


import classes from './Navigation.module.css';

const Navigation: React.FC = () => {
    const modalState = useAppSelector(state => state.modal);
    const user = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    const onLoginClick = () => {
        dispatch(modalActions.open('login'));
    };

    usePreventScrolling(modalState.isOpen);

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
                    <FontAwesomeIcon icon={['fas', 'utensils']} className={classes.icon} />
                    <h2 className={classes['logo-link-long']}>Food Delivery Network</h2>
                    <h2 className={classes['logo-link-short']}>FDN</h2>
                </NavLink>
                <nav>
                    <ul className={classes['nav-list']}>
                        <li className={classes['nav-list-item']}>
                            <NavLink to={user._id ? `/profile/${user._id}/favorites` : '/favorites'}>
                                <FontAwesomeIcon icon={['far', 'heart']} className={classes['user-icon']} />
                            </NavLink>
                        </li>
                        <li className={classes['nav-list-item']}>
                            {user.email ?
                                <UserIcon /> :
                                <FontAwesomeIcon icon={['far', 'user-circle']} onClick={onLoginClick} className={classes['user-icon']} />
                            }
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Navigation;