import classes from './Kitchens.module.css';

const Kitchens = () => {
    return (
        <section className={classes.kitchens}>
            <h2 className={classes['kitchens-title']}>Popular categories</h2>
            <article className={classes.kitchen}>
                <p className={classes['kitchen-name']}>Italian</p>
                <img src="images/kitchen-italian.jpg" alt="italian-kitchen" />
            </article>
            <article className={classes.kitchen}>
                <p className={classes['kitchen-name']}>French</p>
                <img src="images/kitchen-french.jpg" alt="french-kitchen" />
            </article>
            <article className={classes.kitchen}>
                <p className={classes['kitchen-name']}>Chinese</p>
                <img src="images/kitchen-chinese.jpg" alt="chinese-kitchen" />
            </article>
            <article className={classes.kitchen}>
                <p className={classes['kitchen-name']}>Fast Food</p>
                <img src="images/fast-food.jpg" alt="fast-food" />
            </article>
            <article className={classes.kitchen}>
                <p className={classes['kitchen-name']}>Vegetarian</p>
                <img src="images/vegetarian.jpg" alt="vegetarian-kitchen" />
            </article>
            <article className={classes.kitchen}>
                <p className={classes['kitchen-name']}>Drinks</p>
                <img src="images/drinks.jpg" alt="drinks" />
            </article>
        </section>
    );
}

export default Kitchens;