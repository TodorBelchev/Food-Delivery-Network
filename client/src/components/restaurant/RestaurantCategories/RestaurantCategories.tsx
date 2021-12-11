import { memo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import IRecipe from '../../../interfaces/IRecipe';

import RestaurantCategoryList from "../RestaurantCategoryList/RestaurantCategoryList";


import classes from './RestaurantCategories.module.css';


type RestaurantCategoriesProps = JSX.IntrinsicElements['section'] & {
    categories: string[];
    recipes: IRecipe[];
}

const RestaurantCategories: React.FC<RestaurantCategoriesProps> = memo(
    ({ categories, recipes }) => {
        return (
            <section className={'container'}>
                {categories.map(category => {
                    const categoryRecipes = recipes.filter(recipe => recipe.category === category);

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
    },
    (prevProps, nextProps) => prevProps.categories === nextProps.categories);

export default RestaurantCategories;