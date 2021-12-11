import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { useAppSelector } from "../../../hooks/reduxHooks";
import useHttp from "../../../hooks/useHttp";
import IRestaurant from "../../../interfaces/IRestaurant";
import restaurantOptions from "../../../utils/restaurantOptions";
import { constructNewQuery, extractQueryObject } from "../../../utils/queryHelper";

import Spinner from "../../UI/Spinner/Spinner";
import RestaurantList from "../RestaurantList/RestaurantList";
import Paginator from "../../UI/Paginator/Paginator";

const FavoriteRestaurants: React.FC = () => {
    const location = useLocation();
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const { sendRequest, isLoading } = useHttp();
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const user = useAppSelector(state => state.auth);

    const processResponse = useCallback((res: { restaurants: IRestaurant[], count: number }) => {
        setRestaurants(res.restaurants);
        setTotalCount(res.count);
    }, []);

    useEffect(() => {
        const query = extractQueryObject(location.search);
        query.favorites = JSON.stringify(user.favorites);
        setPage(Number(query.page) || 1);
        sendRequest(restaurantOptions.getFavorites(constructNewQuery(query)), processResponse);
    }, [sendRequest, user.favorites, processResponse, location.search]);

    return (
        <div className={'container'}>
            {isLoading && <Spinner />}
            {!isLoading && restaurants.length > 0 && <RestaurantList restaurants={restaurants} />}
            {!isLoading && restaurants.length === 0 && <h2>No favorite restaurants yet!</h2>}
            {!isLoading && totalCount > 16 && <Paginator shownCount={16} totalCount={totalCount} page={page} isLoading={isLoading} />}
        </div>
    )
};

export default FavoriteRestaurants;