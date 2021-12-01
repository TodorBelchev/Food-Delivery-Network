import { useEffect, useState } from "react";
import { useParams } from "react-router";

import useHttp from "../../hooks/useHttp";
import IRestaurant from "../../interfaces/IRestaurant";

import RestaurantCard from "../../components/restaurant/RestaurantCard/RestaurantCard";
import Spinner from "../../components/UI/Spinner/Spinner";


import classes from './City.module.css';

const City: React.FC = () => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const { cityName } = useParams<{ cityName: string }>();
    const { sendRequest, isLoading } = useHttp();

    useEffect(() => {
        sendRequest({
            url: 'http://localhost:3030/api/restaurant?city=' + cityName
        }, (res: IRestaurant[]) => { setRestaurants(res) });
    }, [sendRequest, cityName]);

    return (
        <section className={'container'}>
            {isLoading && <Spinner />}
            <ul className={classes.list}>
                {restaurants.map(x => <RestaurantCard key={x._id} restaurant={x} />)}
            </ul>
        </section>
    );
};

export default City;