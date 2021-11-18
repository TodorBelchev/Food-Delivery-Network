import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import classes from './Footer.module.css';

const Footer: React.FC = () => {
    return (
        <footer className={classes.footer}>
            <section className={classes['footer-wrapper']}>
                <ul className={classes['footer-list']}>
                    <li className={classes['footer-list-item']}>
                        <Link className={classes['footer-list-item-link']} to="/contacts">Contacts</Link>
                    </li>
                    <li className={classes['footer-list-item']}>
                        <Link className={classes['footer-list-item-link']} to="/about-us">About us</Link>
                    </li>
                    <li className={classes['footer-list-item']}>
                        <Link className={classes['footer-list-item-link']} to="/terms-and-condition">Terms and conditions</Link>
                    </li>
                </ul>
                <ul className={`${classes.social} ${classes['footer-list']}`}>
                    <li className={classes['footer-list-item']}>
                        <a className={classes['footer-list-item-link']} href="http://facebook.com" target="_blank" rel="noreferrer">
                            <FontAwesomeIcon icon={['fab', 'facebook-square']} className={classes['footer-icon']} />
                        </a>
                    </li>
                    <li className={classes['footer-list-item']}>
                        <a className={classes['footer-list-item-link']} href="http://instagram.com" target="_blank" rel="noreferrer">
                            <FontAwesomeIcon icon={['fab', 'instagram-square']} className={classes['footer-icon']} />
                        </a>
                    </li>
                    <li className={classes['footer-list-item']}>
                        <a className={classes['footer-list-item-link']} href="http://twitter.com" target="_blank" rel="noreferrer">
                        <FontAwesomeIcon icon={['fab', 'twitter-square']} className={classes['footer-icon']} />
                        </a>
                    </li>
                </ul>
                <p className={classes.end}>&copy; This site is made with educational purpose only! No rights reserved!</p>
            </section>
        </footer >
    );
};

export default Footer;