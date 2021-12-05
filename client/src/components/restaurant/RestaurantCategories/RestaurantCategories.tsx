import { v4 as uuidv4 } from 'uuid';

import { useAppSelector } from '../../../hooks/reduxHooks';

import RestaurantCategoryList from "../RestaurantCategoryList/RestaurantCategoryList";


import classes from './RestaurantCategories.module.css';


const RestaurantCategories: React.FC = () => {
    const restaurant = useAppSelector(state => state.restaurant);
    return (
        <section className={'container'}>
            {restaurant.categories.map(category => {
                const categoryRecipes = restaurant.recipes.filter(recipe => recipe.category === category);


                if (categoryRecipes.length > 0) {
                    return <RestaurantCategoryList key={uuidv4()} categoryRecipes={categoryRecipes} />;
                } else {
                    return <div key={uuidv4()}>
                        <h3 className={classes['category-title']}>{category}</h3>
                        <p>No recipes yet!</p>
                    </div>;
                }
            })}
        </section>
    )
}

export default RestaurantCategories;