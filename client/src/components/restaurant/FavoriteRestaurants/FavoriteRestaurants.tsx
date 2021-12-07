import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/reduxHooks";

import useHttp from "../../../hooks/useHttp";
import IRestaurant from "../../../interfaces/IRestaurant";
import restaurantOptions from "../../../utils/restaurantOptions";

import Spinner from "../../UI/Spinner/Spinner";
import RestaurantList from "../RestaurantList/RestaurantList";

const FavoriteRestaurants: React.FC = () => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const { sendRequest, isLoading } = useHttp();
    const user = useAppSelector(state => state.auth);

    const processResponse = useCallback((res: IRestaurant[]) => {
        setRestaurants(res);
    }, [])

    useEffect(() => {
        const query = user.favorites.join('&');
        sendRequest(restaurantOptions.getFavorites(query), processResponse);
    }, [sendRequest, user.favorites, processResponse]);
    return (
        <div className={'container'}>
            {isLoading && <Spinner />}
            {!isLoading && restaurants.length > 0 && <RestaurantList restaurants={restaurants} />}
            {!isLoading && restaurants.length === 0 && <h2>No favorite restaurants yet!</h2>}
        </div>
    )
};

export default FavoriteRestaurants;