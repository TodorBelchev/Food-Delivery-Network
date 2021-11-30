import { NavLink } from 'react-router-dom';


import classes from './Cities.module.css';

const Cities = () => {
    return (
        <section className={`${classes.cities} container`}>
            <h2 className={classes['cities-title']}>Select your city</h2>
            <article className={classes['city']}>
                <NavLink to="/city/Sofia">
                    <p className={classes['city-name']}>Sofia</p>
                    <img src="/images/Sofia.jpg" alt="sofia-img" />
                </NavLink>
            </article>
            <article className={classes['city']}>
                <NavLink to="/city/Varna">
                    <p className={classes['city-name']}>Varna</p>
                    <img src="/images/Varna.jpg" alt="varna-img" />
                </NavLink>
            </article>
            <article className={classes['city']}>
                <NavLink to="/city/Plovdiv">
                    <p className={classes['city-name']}>Plovdiv</p>
                    <img src="/images/Plovdiv.jpg" alt="plovdiv-img" />
                </NavLink>
            </article>
            <article className={classes['city']}>
                <NavLink to="/city/Burgas">
                    <p className={classes['city-name']}>Burgas</p>
                    <img src="/images/Burgas.jpg" alt="burgas-img" />
                </NavLink>
            </article>
            <article className={classes['city']}>
                <NavLink to="/city/Stara-Zagora">
                    <p className={classes['city-name']}>Stara Zagora</p>
                    <img src="/images/Stara-zagora.jpg" alt="stara-zagora-img" />
                </NavLink>
            </article>
            <article className={classes['city']}>
                <NavLink to="/city/Veliko-Tarnovo">
                    <p className={classes['city-name']}>Veliko Tarnovo</p>
                    <img src="/images/Veliko-tarnovo.jpg" alt="veliko-tarnovo-img" />
                </NavLink>
            </article>
            <article className={classes['city']}>
                <NavLink to="/city/Pleven">
                    <p className={classes['city-name']}>Pleven</p>
                    <img src="/images/Pleven.jpg" alt="pleven-img" />
                </NavLink>
            </article>
            <article className={classes['city']}>
                <NavLink to="/city/Blagoevgrad">
                    <p className={classes['city-name']}>Blagoevgrad</p>
                    <img src="/images/Blagoevgrad.jpg" alt="blagoevgrad-img" />
                </NavLink>
            </article>
            <article className={classes['city']}>
                <NavLink to="/city/Ruse">
                    <p className={classes['city-name']}>Ruse</p>
                    <img src="/images/Ruse.jpg" alt="ruse-img" />
                </NavLink>
            </article>
            <article className={classes['city']}>
                <NavLink to="/city/Shumen">
                    <p className={classes['city-name']}>Shumen</p>
                    <img src="/images/Shumen.jpg" alt="shumen-img" />
                </NavLink>
            </article>
        </section>
    );
}

export default Cities;