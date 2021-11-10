import { useEffect, useState } from "react";
import { useParams } from "react-router";

import RestaurantHeader from "../../components/restaurant/RestaurantHeader/RestaurantHeader";
import Spinner from "../../components/UI/Spinner/Spinner";

import { useAppSelector } from "../../hooks/redux-hooks";
import useHttp from "../../hooks/use-http";

import IRestaurant from "../../interfaces/IRestaurant";


const RestaurantDetails: React.FC = () => {
    const { isLoading, sendRequest } = useHttp();
    const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
    const params = useParams<{ id: string }>();
    const { id } = params;
    const user = useAppSelector(state => state.auth);

    const processResponse = (res: IRestaurant) => {
        setRestaurant(res);
    }

    useEffect(() => {
        sendRequest({
            url: 'http://localhost:3030/api/restaurant/' + id
        }, processResponse);
    }, [id, sendRequest]);
    return (
        <>
            {isLoading && <Spinner />}
            {restaurant && <RestaurantHeader restaurant={restaurant} user={user} />}
        </>
    );
}

export default RestaurantDetails;