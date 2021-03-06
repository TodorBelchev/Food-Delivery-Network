import { useEffect } from "react";
import { NavLink } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { authActions } from '../../../store/auth';
import { modalActions } from "../../../store/modal";
import IAuthState from "../../../interfaces/IAuthState";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeleteRestaurantModal from "../DeleteRestaurantModal/DeleteRestaurantModal";
import Modal from "../../UI/Modal/Modal";
import AddRecipeModal from "../../recipe/AddRecipeModal/AddRecipeModal";
import CommentsModal from "../../comment/CommentsModal/CommentsModal";
import ImageSuspense from "../../UI/ImageSuspense/ImageSuspense";


import classes from './RestaurantHeader.module.css';

type RestaurantHeaderProps = JSX.IntrinsicElements['section'] & {
    user: IAuthState;
}

const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ user }) => {
    const restaurant = useAppSelector(state => state.restaurant);
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

    const addRecipeClickHandler = () => {
        dispatch(modalActions.open('add-recipe'));
    }

    const commentClickHandler = () => {
        dispatch(modalActions.open('comment'));
    };

    useEffect(() => {
        return () => {
            dispatch(modalActions.close())
        }
    }, [dispatch]);

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
            {modalState.isOpen &&
                modalState.overlayName === 'comment' &&
                <Modal>
                    <CommentsModal />
                </Modal>
            }
            <ImageSuspense url={restaurant.image.url}>
                <img className={classes['restaurant-img']} src={restaurant.image.url} alt={`${restaurant.name} restaurant`} />
            </ImageSuspense>
            <article className={`${classes['restaurant-content']} container`}>
                <article className={classes['restaurant-content-title-wrapper']}>
                    <NavLink to={`/restaurant/${restaurant._id}`} className={classes['restaurant-content-title']}>{restaurant.name}</NavLink>
                    <h4 className={classes['restaurant-content-subtitle']}>{restaurant.mainTheme}, {restaurant.categories[0]}</h4>
                    <p className={classes.scoring}>
                        <FontAwesomeIcon icon={['fas', 'star']} size="lg" className={restaurant.rating !== 0 ? classes['icon--blue'] : classes['icon--gray']} />
                        {restaurant.rating !== 0 && <span>{restaurant.rating}({restaurant.ratingsCount})</span>}
                    </p>
                </article>
                <p className={classes.icons}>
                    {userIsOwner &&
                        <NavLink to={`/restaurant/${restaurant._id}/edit`}>
                            <FontAwesomeIcon
                                className={classes.icon}
                                icon={['fas', 'edit']}
                            />
                        </NavLink>}
                    {userIsOwner &&
                        <span className={classes['icon--after']}>
                            <FontAwesomeIcon
                                className={classes.icon}
                                onClick={addRecipeClickHandler}
                                icon={['fas', 'hamburger']}
                            />
                        </span>}
                    {userIsOwner &&
                        <NavLink to={`/restaurant/${restaurant._id}/dashboard`}>
                            <FontAwesomeIcon
                                className={classes.icon}
                                icon={['fas', 'tools']}
                            />
                        </NavLink>}
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
                        onClick={commentClickHandler}
                        icon={['far', 'comment']}
                    />
                </p >
            </article>
        </section>
    )
};

export default RestaurantHeader;