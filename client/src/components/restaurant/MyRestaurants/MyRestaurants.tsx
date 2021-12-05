import { useEffect, useState } from "react";

import useHttp from "../../../hooks/useHttp";
import IRestaurant from "../../../interfaces/IRestaurant";
import restaurantOptions from "../../../utils/restaurantOptions";

import Spinner from "../../UI/Spinner/Spinner";
import RestaurantList from "../RestaurantList/RestaurantList";


const MyRestaurants: React.FC = () => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const { sendRequest, isLoading } = useHttp();

    const processResponse = (res: IRestaurant[]) => {
        setRestaurants(res);
    }

    useEffect(() => {
        sendRequest(restaurantOptions.getByOwner(), processResponse);
    }, [sendRequest]);

    return (
        <section className="container">
            {!isLoading && restaurants.length > 0 && <RestaurantList restaurants={restaurants} />}
            {!isLoading && restaurants.length === 0 && <h2>No restaurants yet!</h2>}
            {isLoading && <Spinner />}
        </section>
    )
};

export default MyRestaurants;