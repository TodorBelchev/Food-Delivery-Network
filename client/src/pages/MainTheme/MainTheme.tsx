import { useEffect, useState } from "react";
import { useParams } from "react-router";

import useHttp from "../../hooks/useHttp";
import IRestaurant from "../../interfaces/IRestaurant";
import restaurantOptions from "../../utils/restaurantOptions";

import RestaurantCard from "../../components/restaurant/RestaurantCard/RestaurantCard";
import Spinner from "../../components/UI/Spinner/Spinner";


import classes from './MainTheme.module.css';

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
            <ul className={classes.list}>
                {restaurants.map(x => <RestaurantCard key={x._id} restaurant={x} />)}
            </ul>
        </section>
    );
};

export default MainTheme;