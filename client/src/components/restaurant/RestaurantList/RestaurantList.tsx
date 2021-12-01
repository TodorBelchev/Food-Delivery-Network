import { useEffect, useState } from "react";

import useHttp from "../../../hooks/useHttp";
import IRestaurant from "../../../interfaces/IRestaurant";

import RestaurantCard from "../RestaurantCard/RestaurantCard";


import classes from './RestaurantList.module.css';


const RestaurantList: React.FC = () => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const { sendRequest } = useHttp();

    const processResponse = (res: IRestaurant[]) => {
        setRestaurants(res);
    }

    useEffect(() => {
        sendRequest({
            url: 'http://localhost:3030/api/restaurant/by-owner'
        }, processResponse);
    }, [sendRequest]);

    return (
        <section className="container">
            <ul className={`${classes.list}`}>
                {restaurants.map(x => (
                    <li key={x._id}>
                        <RestaurantCard restaurant={x} />
                    </li>
                ))}
            </ul>
        </section>
    )
};

export default RestaurantList;