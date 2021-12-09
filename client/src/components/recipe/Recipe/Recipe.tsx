import { modalActions } from '../../../store/modal';
import { cartActions } from '../../../store/cart';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import IRecipe from '../../../interfaces/IRecipe';

import AddRecipeModal from '../AddRecipeModal/AddRecipeModal';
import DeleteRecipeModal from '../DeleteRecipeModal/DeleteRecipeModal';
import Modal from '../../UI/Modal/Modal';
import ImageSuspense from '../../UI/ImageSuspense/ImageSuspense';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import classes from './Recipe.module.css';

type RecipeProps = JSX.IntrinsicElements['article'] & {
    recipe: IRecipe;
}

const Recipe: React.FC<RecipeProps> = ({ recipe }) => {
    const dispatch = useAppDispatch();
    const restaurant = useAppSelector(state => state.restaurant);
    const user = useAppSelector(state => state.auth);
    const modalState = useAppSelector(state => state.modal);
    const isAdmin = restaurant.owner === user._id;

    const deleteClickHandler = () => {
        dispatch(modalActions.open(`delete-recipe-${recipe._id}`));
    }

    const editClickHandler = () => {
        dispatch(modalActions.open(`edit-recipe/${recipe._id}`));
    }

    const addToCartHandler = () => {
        dispatch(cartActions.addToCart({ restaurantId: restaurant._id, recipe }));
    }

    return (
        <article className={classes.recipe}>
            {modalState.isOpen &&
                modalState.overlayName === `delete-recipe-${recipe._id}` &&
                <Modal>
                    <DeleteRecipeModal
                        _id={recipe._id}
                        name={recipe.name}
                        restaurantId={restaurant._id}
                    />
                </Modal>
            }
            {modalState.isOpen &&
                modalState.overlayName === `edit-recipe/${recipe._id}` &&
                <Modal>
                    <AddRecipeModal recipe={recipe} />
                </Modal>
            }
            <div className={classes['recipe-img-wrapper']}>
                <ImageSuspense url={recipe.image.url}>
                    <img src={recipe.image.url} alt={recipe.name} />
                </ImageSuspense>
            </div>
            <div className={classes['recipe-content']}>
                <h3 className={classes['recipe-content-title']}>{recipe.name} <span className={classes['recipe-content-weight']}>({recipe.weight}g)</span></h3>
                <p className={classes['recipe-content-text']}>{recipe.ingredients.join(', ')}</p>
                <p>${recipe.price}</p>
            </div>
            <div onClick={addToCartHandler} className={classes['recipe-icon-wrapper']}>
                <FontAwesomeIcon icon={['fas', 'plus']} className={classes['recipe-icon']} />
            </div>
            {isAdmin && <div className={classes['recipe-admin-icons-wrapper']}>
                <FontAwesomeIcon icon={['fas', 'edit']} onClick={editClickHandler} className={classes['recipe-icon']} />
                <FontAwesomeIcon icon={['fas', 'trash']} onClick={deleteClickHandler} className={classes['recipe-icon']} />
            </div>}
        </article>
    )
}

export default Recipe;