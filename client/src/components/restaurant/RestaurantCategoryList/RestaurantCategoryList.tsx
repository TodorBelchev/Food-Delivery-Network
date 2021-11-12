import IRecipe from '../../../interfaces/IRecipe';
import Recipe from '../Recipe/Recipe';
import classes from './RestaurantCategoryList.module.css';

type RestaurantCategoryListProps = JSX.IntrinsicElements['div'] & {
    categoryRecipes: IRecipe[];
}

const RestaurantCategoryList: React.FC<RestaurantCategoryListProps> = ({ categoryRecipes }) => {
    return (
        <div className={`${classes.category} container`}>
            <h2>{categoryRecipes[0].category}</h2>
            {categoryRecipes.map(recipe => <Recipe recipe={recipe} />)}
        </div>
    )
};

export default RestaurantCategoryList;