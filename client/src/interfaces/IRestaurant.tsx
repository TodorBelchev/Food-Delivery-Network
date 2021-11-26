import IRecipe from "./IRecipe";

export default interface IRestaurant {
    _id: string;
    categories: string[];
    cities: { _id: number; name: string }[];
    image: {
        url: string;
        object_id: string;
    };
    mainTheme: string;
    name: string;
    owner: string;
    workDays: string[];
    workHours: string[];
    rating: number;
    ratingsCount: number;
    recipes: IRecipe[];
}