import { useAppDispatch } from '../../../hooks/redux-hooks';
import { cartActions } from '../../../store/cart';
import IRecipe from '../../../interfaces/IRecipe';

import classes from './ShoppingCartListItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
                    <FontAwesomeIcon icon={['fas', 'minus']} onClick={removeFromCartClickHandler} />
                    <span>${recipe.price}</span>
                    <FontAwesomeIcon icon={['fas', 'plus']} onClick={addToCartClickHandler} />
                    <span>${(recipe.price * quantity).toFixed(2)}</span>
                </div>
            </div>
        </li>
    )
}

export default ShoppingCartListItem