import { NavLink } from 'react-router-dom';
import classes from './Kitchens.module.css';

const Kitchens = () => {
    return (
        <section className={`${classes.kitchens} container`}>
            <h2 className={classes['kitchens-title']}>Popular categories</h2>
            <ul className={classes.list}>
                <li className={classes['list-item']}>
                    <NavLink to="/main-theme/Bulgarian" className={classes.kitchen}>
                        <p className={classes['kitchen-name']}>Bulgarian</p>
                        <img src="images/bulgarian.jpg" alt="bulgarian-kitchen" />
                    </NavLink >
                </li>
                <li className={classes['list-item']}>
                    <NavLink to="/main-theme/Italian" className={classes.kitchen}>
                        <p className={classes['kitchen-name']}>Italian</p>
                        <img src="images/kitchen-italian.jpg" alt="italian-kitchen" />
                    </NavLink>
                </li>
                <li className={classes['list-item']}>
                    <NavLink to="/main-theme/French" className={classes.kitchen}>
                        <p className={classes['kitchen-name']}>French</p>
                        <img src="images/kitchen-french.jpg" alt="french-kitchen" />
                    </NavLink>

                </li>
                <li className={classes['list-item']}>
                    <NavLink to="/main-theme/Chinese" className={classes.kitchen}>
                        <p className={classes['kitchen-name']}>Chinese</p>
                        <img src="images/kitchen-chinese.jpg" alt="chinese-kitchen" />
                    </NavLink>

                </li>
                <li className={classes['list-item']}>
                    <NavLink to="/main-theme/Fast Food" className={classes.kitchen}>
                        <p className={classes['kitchen-name']}>Fast Food</p>
                        <img src="images/fast-food.jpg" alt="fast-food" />
                    </NavLink>

                </li>
                <li className={classes['list-item']}>
                    <NavLink to="/main-theme/Vegetarian" className={classes.kitchen}>
                        <p className={classes['kitchen-name']}>Vegetarian</p>
                        <img src="images/vegetarian.jpg" alt="vegetarian-kitchen" />
                    </NavLink>

                </li>
            </ul>
        </section>
    );
}

export default Kitchens;