import { v4 as uuidv4 } from 'uuid';

import IRecipe from '../../../interfaces/IRecipe';
import Recipe from '../Recipe/Recipe';
import classes from './RestaurantCategoryList.module.css';

type RestaurantCategoryListProps = JSX.IntrinsicElements['div'] & {
    categoryRecipes: IRecipe[];
}

const RestaurantCategoryList: React.FC<RestaurantCategoryListProps> = ({ categoryRecipes }) => {
    return (
        <div className={`${classes.category}`}>
            <h2 className={classes['category-title']}>{categoryRecipes[0].category}</h2>
            {categoryRecipes.map(recipe => <Recipe key={uuidv4()} recipe={recipe} />)}
        </div>
    )
};

export default RestaurantCategoryList;