import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import useHttp from "../../../hooks/useHttp";
import IRestaurant from "../../../interfaces/IRestaurant";
import { constructNewQuery, extractQueryObject } from "../../../utils/queryHelper";
import restaurantOptions from "../../../utils/restaurantOptions";

import Spinner from "../../UI/Spinner/Spinner";
import RestaurantList from "../RestaurantList/RestaurantList";
import Paginator from "../../UI/Paginator/Paginator";


import classes from './MyRestaurants.module.css';

const MyRestaurants: React.FC = () => {
    const location = useLocation();
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const { sendRequest, isLoading } = useHttp();
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);

    const processResponse = useCallback((res: { restaurants: IRestaurant[], count: number }) => {
        setRestaurants(res.restaurants);
        setTotalCount(res.count);
    }, []);


    useEffect(() => {
        const query = extractQueryObject(location.search);
        setPage(Number(query.page) || 1);
        sendRequest(restaurantOptions.getByOwner(constructNewQuery(query)), processResponse);
    }, [sendRequest, location.search, processResponse]);

    return (
        <section className="container">
            {!isLoading && restaurants.length > 0 && <RestaurantList restaurants={restaurants} />}
            {!isLoading && restaurants.length === 0 && <h2 className={classes.title}>No restaurants yet!</h2>}
            {isLoading && <Spinner />}
            {!isLoading && totalCount > 16 && <Paginator shownCount={16} totalCount={totalCount} page={page} isLoading={isLoading} />}
        </section>
    )
};

export default MyRestaurants;