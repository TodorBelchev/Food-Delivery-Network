import classes from './Benefits.module.css';

const Benefits = () => {
    return (
        <section className={classes.benefits}>
            <article className={classes['benefits-img']}>
                <img src="/images/firmbee-com-SpVHcbuKi6E-unsplash.jpg" alt="all-devices" />
            </article>
            <article className={classes['benefits-content']}>
                <h1 className={classes['benefits-content-title']}>Experience our app on all your devices</h1>
                <p className={classes['benefits-content-subtitle']}>Separate design for computer, tablet and phones</p>
                <p className={classes['benefits-content-subtitle']}>You can find the best food near you with click of your finger</p>
                <h1 className={classes['benefits-content-title']}>Fast delivery</h1>
                <p className={classes['benefits-content-subtitle']}>Delivery is made at your most convenient time</p>
                <h1 className={classes['benefits-content-title']}>Multiple types of payment</h1>
                <p className={classes['benefits-content-subtitle']}>Pay with card, on delivery or even setup your own budget</p>
            </article>
        </section>
    );
}

export default Benefits;