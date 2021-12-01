import React from 'react';
import { useHistory } from 'react-router';
import { NavLink } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { modalActions } from '../../../store/modal';
import IRestaurant from '../../../interfaces/IRestaurant';

import Modal from '../../UI/Modal/Modal';
import DeleteRestaurantModal from '../DeleteRestaurantModal/DeleteRestaurantModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import classes from './RestaurantCard.module.css';

type RestaurantCardProps = JSX.IntrinsicElements['article'] & {
    restaurant: IRestaurant
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
    const modalState = useAppSelector(state => state.modal);
    const user = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const isOwner = user._id === restaurant.owner;
    const history = useHistory();

    const dashboardClickHandler = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        history.push(`/restaurant/${restaurant._id}/dashboard`);
    }

    const deleteClickHandler = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        dispatch(modalActions.open('delete-restaurant'));
    }

    return (
        <article className={classes.restaurant}>
            {modalState.isOpen &&
                modalState.overlayName === 'delete-restaurant' &&
                <Modal>
                    <DeleteRestaurantModal _id={restaurant._id} name={restaurant.name} />
                </Modal>
            }
            <NavLink to={`/restaurant/${restaurant._id}`}>
                <article className={classes['restaurant-image-wrapper']}>
                    <img className={classes['restaurant-img-wrapper-img']} src={restaurant.image.url} alt="pizza" />
                </article>
                <article className={classes['restaurant-title-wrapper']}>
                    <h2 className={classes['restaurant-title']}>{restaurant.name}</h2>
                    <p className={classes['restaurant-score']}>
                        <FontAwesomeIcon icon={['fas', 'star']} className={`${classes['restaurant-score-icon']} ${restaurant.rating === 0 ? classes['restaurant-score-icon--gray'] : ''}`} />
                        {restaurant.rating !== 0 && <span>{restaurant.rating}({restaurant.ratingsCount})</span>}
                    </p>
                </article>
                <article className={classes['restaurant-text-wrapper']}>
                    <p className={classes.description}>{restaurant.mainTheme}, {restaurant.categories[0]}</p>
                    {isOwner && <div>
                        <span onClick={dashboardClickHandler} >
                            <FontAwesomeIcon icon={['fas', 'tools']} className={classes.icon} />
                        </span>
                        <span onClick={deleteClickHandler} >
                            <FontAwesomeIcon icon={['fas', 'trash']} className={classes.icon} />
                        </span>
                    </div>}
                </article>
            </NavLink>
        </article>
    )
};

export default RestaurantCard;