import { useAppDispatch } from '../../../hooks/reduxHooks';
import { cartActions } from '../../../store/cart';
import IRecipe from '../../../interfaces/IRecipe';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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
            <div className={classes['cart-item-text']}>{recipe.name} ({recipe.weight}g) <span>x {quantity}</span></div>
            <div className={classes['cart-item-controls']}>
                <div className={classes['cart-item-icons']}>
                    <FontAwesomeIcon className={classes['icon--red']} icon={['fas', 'minus']} onClick={removeFromCartClickHandler} />
                    <span>${recipe.price}</span>
                    <FontAwesomeIcon className={classes['icon--green']} icon={['fas', 'plus']} onClick={addToCartClickHandler} />
                    <span>${(recipe.price * quantity).toFixed(2)}</span>
                </div>
            </div>
        </li>
    )
}

export default ShoppingCartListItem