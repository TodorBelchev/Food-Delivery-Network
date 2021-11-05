import classes from './Cities.module.css';

const Cities = () => {
    return (
        <section className={`${classes.cities} container`}>
            <h2 className={classes['cities-title']}>Select your city</h2>
            <article className={classes['city']}>
                <a href="/city/Sofia">
                    <p className={classes['city-name']}>Sofia</p>
                    <img src="/images/Sofia.jpg" alt="sofia-img" />
                </a>
            </article>
            <article className={classes['city']}>
                <a href="/city/Varna">
                    <p className={classes['city-name']}>Varna</p>
                    <img src="/images/Varna.jpg" alt="varna-img" />
                </a>
            </article>
            <article className={classes['city']}>
                <a href="/city/Plovdiv">
                    <p className={classes['city-name']}>Plovdiv</p>
                    <img src="/images/Plovdiv.jpg" alt="plovdiv-img" />
                </a>
            </article>
            <article className={classes['city']}>
                <a href="/city/Burgas">
                    <p className={classes['city-name']}>Burgas</p>
                    <img src="/images/Burgas.jpg" alt="burgas-img" />
                </a>
            </article>
            <article className={classes['city']}>
                <a href="/city/Stara-zagora">
                    <p className={classes['city-name']}>Stara Zagora</p>
                    <img src="/images/Stara-zagora.jpg" alt="stara-zagora-img" />
                </a>
            </article>
            <article className={classes['city']}>
                <a href="/city/Veliko-tarnovo">
                    <p className={classes['city-name']}>Veliko Tarnovo</p>
                    <img src="/images/Veliko-tarnovo.jpg" alt="veliko-tarnovo-img" />
                </a>
            </article>
            <article className={classes['city']}>
                <a href="/city/Pleven">
                    <p className={classes['city-name']}>Pleven</p>
                    <img src="/images/Pleven.jpg" alt="pleven-img" />
                </a>
            </article>
            <article className={classes['city']}>
                <a href="/city/Blagoevgrad">
                    <p className={classes['city-name']}>Blagoevgrad</p>
                    <img src="/images/Blagoevgrad.jpg" alt="blagoevgrad-img" />
                </a>
            </article>
            <article className={classes['city']}>
                <a href="/city/Ruse">
                    <p className={classes['city-name']}>Ruse</p>
                    <img src="/images/Ruse.jpg" alt="ruse-img" />
                </a>
            </article>
            <article className={classes['city']}>
                <a href="/city/Shumen">
                    <p className={classes['city-name']}>Shumen</p>
                    <img src="/images/Shumen.jpg" alt="shumen-img" />
                </a>
            </article>
        </section>
    );
}

export default Cities;