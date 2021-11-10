import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
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
                <li>
                    {restaurants.map(x => <RestaurantCard key={x._id} restaurant={x} />)}
                </li>
            </ul>
        </section>
    )
};

export default RestaurantList;