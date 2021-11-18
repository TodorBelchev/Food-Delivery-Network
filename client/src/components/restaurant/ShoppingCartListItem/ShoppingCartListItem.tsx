import { useAppDispatch } from '../../../hooks/redux-hooks';
import { cartActions } from '../../../store/cart';
import IRecipe from '../../../interfaces/IRecipe';

import classes from './ShoppingCartListItem.module.css';

type ShoppingCartListItemProps = JSX.IntrinsicElements['li'] & {
    recipe: IRecipe;
    quantity: number;
    restaurantId: string;
}

const ShoppingCartListItem: React.FC<ShoppingCartListItemProps> = ({ recipe, quantity, restaurantId }) => {
    const dispatch = useAppDispatch();
    const addToCartClickHandler = () => {
        dispatch(cartActions.addToCart({ restaurantId, recipe }));
    }

    const removeFromCartClickHandler = () => {
        dispatch(cartActions.removeFromCart({ restaurantId, recipe }));
    }
    return (
        <li className={classes['cart-item']}>
            <div className={classes['cart-item-text']}>{recipe.name} <span>x{quantity}</span></div>
            <div className={classes['cart-item-controls']}>
                <div className={classes['cart-item-icons']}>
                    <img onClick={removeFromCartClickHandler} src="/icons/minus-solid.svg" alt="remove from cart" />
                    <span>${recipe.price}</span>
                    <img onClick={addToCartClickHandler} src="/icons/plus-solid.svg" alt="add to cart" />
                    <span>${(recipe.price * quantity).toFixed(2)}</span>
                </div>
            </div>
        </li>
    )
}

export default ShoppingCartListItem