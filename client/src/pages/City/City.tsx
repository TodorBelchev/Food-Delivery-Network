import { useEffect, useState } from "react";
import { useParams } from "react-router";

import useHttp from "../../hooks/useHttp";
import IRestaurant from "../../interfaces/IRestaurant";
import restaurantOptions from "../../utils/restaurantOptions";

import Spinner from "../../components/UI/Spinner/Spinner";


import RestaurantList from "../../components/restaurant/RestaurantList/RestaurantList";

const City: React.FC = () => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const { cityName } = useParams<{ cityName: string }>();
    const { sendRequest, isLoading } = useHttp();

    useEffect(() => {
        sendRequest(
            restaurantOptions.getByCity(cityName),
            (res: IRestaurant[]) => { setRestaurants(res) }
        );
    }, [sendRequest, cityName]);

    return (
        <section className={'container'}>
            {isLoading && <Spinner />}
            {!isLoading && restaurants.length > 0 && <RestaurantList restaurants={restaurants} />}
            {!isLoading && restaurants.length === 0 && <h2>No restaurants yet!</h2>}
        </section>
    );
};

export default City;