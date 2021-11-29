import IRecipe from "./IRecipe";
import IRestaurant from "./IRestaurant";

export default interface IOrder {
    _id: string;
    name: string;
    phone: number;
    city: string;
    address: string;
    status: string;
    items: { item: IRecipe, price: number; quantity: number }[];
    restaurant: IRestaurant;
    date: Date;
}