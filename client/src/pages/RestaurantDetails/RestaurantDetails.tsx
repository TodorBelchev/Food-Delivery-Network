import { useEffect, useState } from "react";
import { Route, Switch, useParams } from "react-router";

import CreateRestaurant from "../../components/restaurant/CreateRestaurant/CreateRestaurant";
import RestaurantCategories from "../../components/restaurant/RestaurantCategories/RestaurantCategories";
import RestaurantDashboard from "../../components/restaurant/RestaurantDashboard/RestaurantDashboard";
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
            <Switch>
                <Route path="/restaurant/:id/dashboard">
                    <RestaurantDashboard />
                </Route>
                <Route path="/restaurant/:id/edit">
                    {restaurant && <CreateRestaurant edit={true} restaurant={restaurant} setRestaurant={setRestaurant} />}
                </Route>
                <Route path="/">
                    {restaurant && <RestaurantCategories recipes={restaurant.recipes} restaurantId={restaurant._id} categories={restaurant.categories} />}
                </Route>
            </Switch>
        </>
    );
}

export default RestaurantDetails;