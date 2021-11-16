import { modalActions } from '../../../store/modal';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import IRecipe from '../../../interfaces/IRecipe';

import classes from './Recipe.module.css';
import DeleteRecipeModal from '../DeleteRecipeModal/DeleteRecipeModal';
import Modal from '../../UI/Modal/Modal';

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
            <div className={classes['recipe-img-wrapper']}>
                <img src={recipe.image.url} alt={recipe.name} />
            </div>
            <div className={classes['recipe-content']}>
                <h3>{recipe.name}</h3>
                <p className={classes['recipe-content-text']}>{recipe.ingredients.join(', ')}</p>
                <p>${recipe.price}</p>
            </div>
            <div className={classes['recipe-icon-wrapper']}>
                <img src="/icons/plus-solid.svg" alt="plus" />
            </div>
            {isAdmin && <div className={classes['recipe-admin-icons-wrapper']}>
                <img src="/icons/edit-solid --small.svg" alt="edit" />
                <img onClick={deleteClickHandler} src="/icons/trash-solid--small.svg" alt="trash" />
            </div>}
        </article>
    )
}

export default Recipe;