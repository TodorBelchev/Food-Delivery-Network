import { useAppDispatch } from "../../../hooks/redux-hooks";
import  { authActions } from '../../../store/auth';

import IAuthState from "../../../interfaces/IAuthState";
import IRestaurant from "../../../interfaces/IRestaurant";

import classes from './RestaurantHeader.module.css';

type RestaurantHeaderProps = JSX.IntrinsicElements['section'] & {
    restaurant: IRestaurant;
    user: IAuthState;
}

const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurant, user }) => {
    const dispatch = useAppDispatch();
    const userIsOwner = user._id === restaurant.owner;
    const restaurantIsInFavorites = user.favorites.includes(restaurant._id);

    const addToFavoritesHandler = () => {
        dispatch(authActions.addToFavorites({ _id: restaurant._id}));
    }

    const removeFromFavoritesHandler = () => {
        dispatch(authActions.removeFromFavorites({ _id: restaurant._id}));
    }

    return (
        <section>
            <img className={classes['restaurant-img']} src={restaurant.image} alt="" />
            <article className={`${classes['restaurant-content']} container`}>
                <article className={classes['restaurant-content-title-wrapper']}>
                    <h2 className={classes['restaurant-content-title']}>{restaurant.name}</h2>
                    <h4 className={classes['restaurant-content-subtitle']}>{restaurant.mainTheme}, {restaurant.categories[0]}</h4>
                    <p className={classes.scoring}><img src="/icons/star-solid.svg" alt="star" /><span>4.5(30)</span></p>
                </article>
                <p className={classes.icons}>
                    {userIsOwner && <img src="/icons/tools-solid.svg" alt="edit button" />}
                    {userIsOwner && <img src="/icons/trash-solid.svg" alt="delete button" />}
                    {!restaurantIsInFavorites && <img onClick={addToFavoritesHandler} src="/icons/heart-regular.svg" alt="heart" />}
                    {restaurantIsInFavorites && <img onClick={removeFromFavoritesHandler} src="/icons/heart-solid.svg" alt="heart" />}
                    <img src="/icons/comment-regular.svg" alt="comment" />
                </p >
            </article>
        </section>
    )
};

export default RestaurantHeader;