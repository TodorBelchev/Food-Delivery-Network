import { useEffect, useState } from "react";
import { useParams } from "react-router";
import RestaurantCard from "../../components/restaurant/RestaurantCard/RestaurantCard";

import useHttp from "../../hooks/useHttp";
import IRestaurant from "../../interfaces/IRestaurant";


import classes from './City.module.css';

const City: React.FC = () => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const { cityName } = useParams<{ cityName: string }>();
    const { sendRequest } = useHttp();

    useEffect(() => {
        sendRequest({
            url: 'http://localhost:3030/api/restaurant?city=' + cityName
        }, (res: IRestaurant[]) => { setRestaurants(res) });
    }, [sendRequest, cityName]);

    return (
        <section className={'container'}>
            <ul className={classes.list}>
                {restaurants.map(x => <RestaurantCard key={x._id} restaurant={x} />)}
            </ul>
        </section>
    );
};

export default City;