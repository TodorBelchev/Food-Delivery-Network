import IRecipe from "./IRecipe";

type Restaurants = {
    restaurantId: string;
    recipes: {
        recipe: IRecipe,
        quantity: number
    }[];
}

export default interface ICartState {
    restaurants: Restaurants[];
}