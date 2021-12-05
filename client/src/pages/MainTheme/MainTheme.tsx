import { useEffect, useState } from "react";
import { useParams } from "react-router";

import useHttp from "../../hooks/useHttp";
import IRestaurant from "../../interfaces/IRestaurant";
import restaurantOptions from "../../utils/restaurantOptions";

import Spinner from "../../components/UI/Spinner/Spinner";


import RestaurantList from "../../components/restaurant/RestaurantList/RestaurantList";

const MainTheme: React.FC = () => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const { mainTheme } = useParams<{ mainTheme: string }>();
    const { sendRequest, isLoading } = useHttp();

    useEffect(() => {
        sendRequest(
            restaurantOptions.getByTheme(mainTheme),
            (res: IRestaurant[]) => { setRestaurants(res) }
        );
    }, [sendRequest, mainTheme]);

    return (
        <section className={'container'}>
            {isLoading && <Spinner />}
            {!isLoading && restaurants.length > 0 && <RestaurantList restaurants={restaurants} />}
            {!isLoading && restaurants.length === 0 && <h2>No restaurants yet!</h2>}
        </section>
    );
};

export default MainTheme;