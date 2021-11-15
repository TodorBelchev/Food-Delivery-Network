import { v4 as uuidv4 } from 'uuid';
import { useAppSelector } from '../../../hooks/redux-hooks';

import RestaurantCategoryList from "../RestaurantCategoryList/RestaurantCategoryList";


const RestaurantCategories: React.FC = () => {
    const restaurant = useAppSelector(state => state.restaurant);
    return (
        <section className={'container'}>
            {restaurant.categories.map(category => {
                const categoryRecipes = restaurant.recipes.filter(recipe => recipe.category === category);

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