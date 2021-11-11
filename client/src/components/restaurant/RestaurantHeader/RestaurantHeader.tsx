import { useHistory } from "react-router";

import { useAppDispatch, useAppSelector } from "../../../hooks/redux-hooks";
import { authActions } from '../../../store/auth';
import { modalActions } from "../../../store/modal";

import IAuthState from "../../../interfaces/IAuthState";
import IRestaurant from "../../../interfaces/IRestaurant";

import DeleteRestaurantModal from "../DeleteRestaurantModal/DeleteRestaurantModal";
import Modal from "../../UI/Modal/Modal";
import AddRecipeModal from "../AddRecipeModal/AddRecipeModal";

import classes from './RestaurantHeader.module.css';

type RestaurantHeaderProps = JSX.IntrinsicElements['section'] & {
    restaurant: IRestaurant;
    user: IAuthState;
}

const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurant, user }) => {
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
        dispatch(modalActions.open('delete-restaurant'));
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
                modalState.overlayName === 'delete-restaurant' &&
                <Modal>
                    <DeleteRestaurantModal _id={restaurant._id} name={restaurant.name} />
                </Modal>
            }
            {modalState.isOpen &&
                modalState.overlayName === 'add-recipe' &&
                <Modal>
                    <AddRecipeModal _id={restaurant._id} categories={restaurant.categories} />
                </Modal>
            }
            <img className={classes['restaurant-img']} src={restaurant.image.url} alt="" />
            <article className={`${classes['restaurant-content']} container`}>
                <article className={classes['restaurant-content-title-wrapper']}>
                    <h2 className={classes['restaurant-content-title']}>{restaurant.name}</h2>
                    <h4 className={classes['restaurant-content-subtitle']}>{restaurant.mainTheme}, {restaurant.categories[0]}</h4>
                    <p className={classes.scoring}><img src="/icons/star-solid.svg" alt="star" /><span>4.5(30)</span></p>
                </article>
                <p className={classes.icons}>
                    {userIsOwner && <img onClick={editClickHandler} src="/icons/edit-solid.svg" alt="edit button" />}
                    {userIsOwner && <img onClick={addRecipeClickHandler} src="/icons/add.png" alt="add recipe button" />}
                    {userIsOwner && <img onClick={dashboardClickHandler} src="/icons/tools-solid.svg" alt="dashboard button" />}
                    {userIsOwner && <img onClick={deleteClickHandler} src="/icons/trash-solid.svg" alt="delete button" />}
                    {!restaurantIsInFavorites && <img onClick={addToFavoritesHandler} src="/icons/heart-regular.svg" alt="heart" />}
                    {restaurantIsInFavorites && <img onClick={removeFromFavoritesHandler} src="/icons/heart-solid.svg" alt="heart" />}
                    <img src="/icons/comment-regular.svg" alt="comment" />
                </p >
            </article>
        </section>
    )
};

export default RestaurantHeader;