import classes from './Hero.module.css';

const Hero: React.FC = () => {
    return(
        <section className={classes.hero}>
        <article className={classes['hero-content']}>
            <h1 className={classes['hero-content-title']}>Order your favorite food</h1>
            <p className={classes['hero-content-subtitle']}>Enjoy fast delivery to your address or take it yourself from the restaurant
            </p>
            <p className={classes['hero-content-subtitle']}>Choose from the richest catalog out in the internet</p>
        </article>
        <article className={classes['hero-img']}>
            <img src="/images/mahyar-motebassem-pGA4zHvpo5E-unsplash.jpg" alt="food" />
        </article>
    </section>
    );
}

export default Hero;