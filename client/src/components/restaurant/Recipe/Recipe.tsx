import IRecipe from '../../../interfaces/IRecipe';
import classes from './Recipe.module.css';

type RecipeProps = JSX.IntrinsicElements['article'] & {
    recipe: IRecipe;
}

const Recipe: React.FC<RecipeProps> = ({ recipe }) => {
    return (
        <article className={classes.recipe}>
            <h3>{recipe.name}</h3>
            <p>{recipe.ingredients.join(', ')}</p>
            <p>${recipe.price}</p>
        </article>
    )
}

export default Recipe;