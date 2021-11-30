import { useEffect, useState } from "react";
import { useParams } from "react-router";
import RestaurantCard from "../../components/restaurant/RestaurantCard/RestaurantCard";

import useHttp from "../../hooks/useHttp";
import IRestaurant from "../../interfaces/IRestaurant";


import classes from './MainTheme.module.css';

const MainTheme: React.FC = () => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const { mainTheme } = useParams<{ mainTheme: string }>();
    const { sendRequest } = useHttp();

    useEffect(() => {
        sendRequest({
            url: 'http://localhost:3030/api/restaurant?mainTheme=' + mainTheme
        }, (res: IRestaurant[]) => { setRestaurants(res) });
    }, [sendRequest, mainTheme]);

    return (
        <section className={'container'}>
            <ul className={classes.list}>
                {restaurants.map(x => <RestaurantCard key={x._id} restaurant={x} />)}
            </ul>
        </section>
    );
};

export default MainTheme;