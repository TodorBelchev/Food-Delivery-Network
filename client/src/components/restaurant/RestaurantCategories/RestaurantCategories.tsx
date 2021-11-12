import { v4 as uuidv4 } from 'uuid';

import IRecipe from "../../../interfaces/IRecipe";
import RestaurantCategoryList from "../RestaurantCategoryList/RestaurantCategoryList";

type RestaurantCategoriesProps = JSX.IntrinsicElements['section'] & {
    recipes: IRecipe[];
    restaurantId: string;
    categories: string[];
}

const RestaurantCategories: React.FC<RestaurantCategoriesProps> = ({ recipes, restaurantId, categories }) => {
    return (
        <section className={'container'}>
            {categories.map(category => {
                const categoryRecipes = recipes.filter(recipe => recipe.category === category);

                if (categoryRecipes.length > 0) {
                    return <RestaurantCategoryList key={uuidv4()} categoryRecipes={categoryRecipes} />;
                } else {
                    return <div key={uuidv4()}>No recipes yet!</div>;
                }
            })}
        </section>
    )
}

export default RestaurantCategories;