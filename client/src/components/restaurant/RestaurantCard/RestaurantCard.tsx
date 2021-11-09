import { NavLink } from 'react-router-dom';

import IRestaurant from '../../../interfaces/IRestaurant';

import classes from './RestaurantCard.module.css';

type RestaurantCardProps = JSX.IntrinsicElements['article'] & {
    restaurant: IRestaurant
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {


    return (
        <NavLink to={`/restaurant/${restaurant._id}`} className={classes.card}>
            <div className={classes['card-image']}>
                <img src={restaurant.image} alt="restaurant" />
            </div>
            <div className={classes['card-content']}>
                <div className={classes['card-content-title-wrapper']}>
                    <h2 className={classes['card-content-title']}>
                        {restaurant.name}
                    </h2>
                    {restaurant.rating !== 0 ? <div className={classes['card-content-rating']}><img src="/icons/star-solid.svg" alt="star" /> <span>4.5(30)</span></div> : null}
                </div>
                <p>Theme: {restaurant.mainTheme}</p>
                <p>Main categories: {restaurant.categories.slice(0, 3).join(', ')}</p>
            </div>
        </NavLink>
    )
};

export default RestaurantCard;