export default interface IRestaurant {
    _id: string;
    categories: string[];
    cities: string[];
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
}