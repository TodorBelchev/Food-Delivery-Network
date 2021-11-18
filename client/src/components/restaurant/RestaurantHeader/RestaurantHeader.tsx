import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useAppDispatch, useAppSelector } from "../../../hooks/redux-hooks";
import { authActions } from '../../../store/auth';
import { modalActions } from "../../../store/modal";

import IAuthState from "../../../interfaces/IAuthState";

import DeleteRestaurantModal from "../DeleteRestaurantModal/DeleteRestaurantModal";
import Modal from "../../UI/Modal/Modal";
import AddRecipeModal from "../AddRecipeModal/AddRecipeModal";


import classes from './RestaurantHeader.module.css';

type RestaurantHeaderProps = JSX.IntrinsicElements['section'] & {
    user: IAuthState;
}

const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ user }) => {
    const restaurant = useAppSelector(state => state.restaurant);
    const history = useHistory();
    const dispatch = useAppDispatch();
    const userIsOwner = user._id === restaurant.owner;
    const restaurantIsInFavorites = user.favorites.includes(restaurant._id);
    const modalState = useAppSelector(state => state.modal);

    const addToFavoritesHandler = () => {
        dispatch(authActions.addToFavorites({ _id: restaurant._id }));
    }

    const removeFromFavoritesHandler = () => {
        dispatch(authActions.removeFromFavorites({ _id: restaurant._id }));
    }

    const deleteClickHandler = () => {
        dispatch(modalActions.open(`delete-restaurant-${restaurant._id}`));
    }

    const dashboardClickHandler = () => {
        history.push(`/restaurant/${restaurant._id}/dashboard`);
    }

    const editClickHandler = () => {
        history.push(`/restaurant/${restaurant._id}/edit`);
    }

    const addRecipeClickHandler = () => {
        dispatch(modalActions.open('add-recipe'));
    }

    return (
        <section>
            {modalState.isOpen &&
                modalState.overlayName === `delete-restaurant-${restaurant._id}` &&
                <Modal>
                    <DeleteRestaurantModal _id={restaurant._id} name={restaurant.name} />
                </Modal>
            }
            {modalState.isOpen &&
                modalState.overlayName === 'add-recipe' &&
                <Modal>
                    <AddRecipeModal />
                </Modal>
            }
            <img className={classes['restaurant-img']} src={restaurant.image.url} alt="" />
            <article className={`${classes['restaurant-content']} container`}>
                <article className={classes['restaurant-content-title-wrapper']}>
                    <NavLink to={`/restaurant/${restaurant._id}`} className={classes['restaurant-content-title']}>{restaurant.name}</NavLink>
                    <h4 className={classes['restaurant-content-subtitle']}>{restaurant.mainTheme}, {restaurant.categories[0]}</h4>
                    <p className={classes.scoring}>
                        <FontAwesomeIcon icon={['fas', 'star']} size="lg" className={classes['icon--blue']} />
                        <span>4.5(30)</span>
                    </p>
                </article>
                <p className={classes.icons}>
                    {userIsOwner &&
                        <FontAwesomeIcon
                            className={classes.icon}
                            onClick={editClickHandler}
                            icon={['fas', 'edit']}
                        />}
                    {userIsOwner &&
                        <span className={classes['icon--after']}>
                            <FontAwesomeIcon
                                className={classes.icon}
                                onClick={addRecipeClickHandler}
                                icon={['fas', 'hamburger']}
                            />
                        </span>}
                    {userIsOwner &&
                        <FontAwesomeIcon
                            className={classes.icon}
                            onClick={dashboardClickHandler}
                            icon={['fas', 'tools']}
                        />}
                    {userIsOwner &&
                        <FontAwesomeIcon
                            className={classes.icon}
                            onClick={deleteClickHandler}
                            icon={['fas', 'trash']}
                        />}
                    {!restaurantIsInFavorites &&
                        <FontAwesomeIcon
                            className={`${classes.icon} ${classes['icon--red']}`}
                            onClick={addToFavoritesHandler}
                            icon={['far', 'heart']}
                        />}
                    {restaurantIsInFavorites &&
                        <FontAwesomeIcon
                            className={`${classes.icon} ${classes['icon--red']}`}
                            onClick={removeFromFavoritesHandler}
                            icon={['fas', 'heart']}
                        />}
                    <FontAwesomeIcon
                        className={`${classes.icon} ${classes['icon--blue']}`}
                        icon={['far', 'comment']}
                    />
                </p >
            </article>
        </section>
    )
};

export default RestaurantHeader;