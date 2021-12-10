import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import useHttp from "../../hooks/useHttp";
import IRestaurant from "../../interfaces/IRestaurant";
import restaurantOptions from "../../utils/restaurantOptions";
import { extractQueryObject, constructNewQuery } from '../../utils/queryHelper';

import Spinner from "../../components/UI/Spinner/Spinner";
import RestaurantList from "../../components/restaurant/RestaurantList/RestaurantList";
import Paginator from "../../components/UI/Paginator/Paginator";

const City: React.FC = () => {
    const history = useHistory();
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const { cityName } = useParams<{ cityName: string }>();
    const { sendRequest, isLoading } = useHttp();

    useEffect(() => {
        const query = extractQueryObject(history.location.search);
        setPage(Number(query.page) || 1);
        sendRequest(
            restaurantOptions.getByCity(cityName, constructNewQuery(query)),
            (res: { restaurants: IRestaurant[], count: number }) => {
                setRestaurants(res.restaurants);
                setTotalCount(res.count);
            }
        );
    }, [sendRequest, cityName, history.location.search]);

    return (
        <section className={'container'}>
            {isLoading && <Spinner />}
            {!isLoading && restaurants.length > 0 && <RestaurantList restaurants={restaurants} />}
            {!isLoading && totalCount > 16 && <Paginator shownCount={16} totalCount={totalCount} page={page} isLoading={isLoading} />}
            {!isLoading && restaurants.length === 0 && <h2>No restaurants yet!</h2>}
        </section>
    );
};

export default City;