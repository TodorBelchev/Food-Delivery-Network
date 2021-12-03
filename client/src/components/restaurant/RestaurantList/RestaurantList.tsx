import { useEffect, useState } from "react";

import useHttp from "../../../hooks/useHttp";
import IRestaurant from "../../../interfaces/IRestaurant";
import restaurantOptions from "../../../utils/restaurantOptions";

import Spinner from "../../UI/Spinner/Spinner";
import RestaurantCard from "../RestaurantCard/RestaurantCard";


import classes from './RestaurantList.module.css';


const RestaurantList: React.FC = () => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const { sendRequest, isLoading } = useHttp();

    const processResponse = (res: IRestaurant[]) => {
        setRestaurants(res);
    }

    useEffect(() => {
        sendRequest(restaurantOptions.getByOwner(), processResponse);
    }, [sendRequest]);

    return (
        <section className="container">
            <ul className={`${classes.list}`}>
                {isLoading && <Spinner />}
                {!isLoading && restaurants.map(x => (
                    <li key={x._id}>
                        <RestaurantCard restaurant={x} />
                    </li>
                ))}
            </ul>
        </section>
    )
};

export default RestaurantList;