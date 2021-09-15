import { NavLink } from 'react-router-dom';

import classes from './Navigation.module.css';

const Navigation: React.FC = () => {
    return (
        <header className={classes.header}>
            <div className={classes.container}>
                <NavLink to="/" className={classes['logo-link']}>
                    <img className={classes.icon} src="/images/utensils-solid.svg" alt=" utensils" />
                    <h2>Food Delivery Network</h2>
                </NavLink>
                <nav>
                    <ul className={classes['nav-list']}>
                        <li className={classes['nav-list-item']}>
                            <NavLink to="/login" className="login-link">Login</NavLink>
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