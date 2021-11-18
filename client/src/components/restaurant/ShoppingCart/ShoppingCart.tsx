import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import ReactDOM from 'react-dom';

import { useAppSelector } from '../../../hooks/redux-hooks';
import { Backdrop } from '../../UI/Modal/Modal';
import ShoppingCartListItem from '../ShoppingCartListItem/ShoppingCartListItem';


import classes from './ShoppingCart.module.css';

const ShoppingCart: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { restaurants } = useAppSelector(state => state.cart);
    const restaurant = useAppSelector(state => state.restaurant);
    const cartRecipes = restaurants.find(x => x.restaurantId === restaurant._id);
    const totalPrice = Number(cartRecipes?.recipes.reduce((acc, curr) => acc += curr.quantity * curr.recipe.price, 0).toFixed(2));
    const totalQuantity = cartRecipes?.recipes.reduce((acc, curr) => acc += curr.quantity, 0);

    const headerClickHandler = () => {
        setIsOpen(oldState => !oldState);
    }

    const backDropClickHandler = () => {
        setIsOpen(false);
    }

    return (
        <>
            {isOpen && ReactDOM.createPortal(
                <div onClick={backDropClickHandler}>
                    <Backdrop />
                </div>,
                document.getElementById('backdrop-root')!
            )}
            <section className={classes.cart}>
                <article onClick={headerClickHandler} className={classes['cart-header']}>
                    <article className={classes['cart-header-img-wrapper']}>
                        <FontAwesomeIcon className={classes['cart-header-img-wrapper-icon']} icon={['fas', 'shopping-cart']} />
                        <div className={classes['cart-header-img-quantity']}>{totalQuantity}</div>
                    </article>
                    <div className={classes['cart-header-text']}>
                        <p >Cart(<span>${totalPrice}</span>)</p>
                        {!isOpen && <FontAwesomeIcon icon={['fas', 'chevron-up']} />}
                        {isOpen && <FontAwesomeIcon icon={['fas', 'chevron-down']} />}
                    </div>
                </article>
                {isOpen && <section className={classes['cart-content']}>
                    <article className={classes['cart-content-recipes']}>
                        <ul className={classes['cart-content-recipes-list']}>
                            {cartRecipes?.recipes.map(x => (
                                <ShoppingCartListItem
                                    key={x.recipe._id}
                                    recipe={x.recipe}
                                    quantity={x.quantity}
                                    restaurantId={restaurant._id}
                                />
                            ))}
                        </ul>
                        <article className={classes['cart-content-summary']}>
                            <p>
                                <span>Order:</span>
                                <span>${totalPrice}</span>
                            </p>
                            <p>
                                <span>Delivery:</span>
                                <span>{totalPrice > 10 ? 'Free' : '$3.99'}</span>
                            </p>
                            <p>
                                <span>Total:</span>
                                <span>${totalPrice > 10 ? totalPrice : (totalPrice + 3.99).toFixed(2)}</span>
                            </p>
                        </article>
                    </article>
                    <article className={classes['cart-content-checkout']}>

                    </article>
                </section>}
            </section>
        </>
    );
};

export default ShoppingCart;