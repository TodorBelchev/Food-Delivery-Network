export default interface IRecipe {
    _id: string;
    name: string;
    price: number;
    category: string;
    weight: number;
    ingredients: string[];
    image: {
        url: string;
        object_id: string;
    };
}