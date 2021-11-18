import { useCallback, useEffect } from "react";
import { Route, Switch, useParams } from "react-router";

import CreateRestaurant from "../../components/restaurant/CreateRestaurant/CreateRestaurant";
import RestaurantCategories from "../../components/restaurant/RestaurantCategories/RestaurantCategories";
import RestaurantDashboard from "../../components/restaurant/RestaurantDashboard/RestaurantDashboard";
import RestaurantHeader from "../../components/restaurant/RestaurantHeader/RestaurantHeader";
import Spinner from "../../components/UI/Spinner/Spinner";

import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import useHttp from "../../hooks/use-http";
import { restaurantActions } from "../../store/restaurant";

import IRestaurant from "../../interfaces/IRestaurant";
import ShoppingCart from "../../components/restaurant/ShoppingCart/ShoppingCart";


const RestaurantDetails: React.FC = () => {
    const dispatch = useAppDispatch();
    const restaurant = useAppSelector(state => state.restaurant);
    const { isLoading, sendRequest } = useHttp();
    const { id } = useParams<{ id: string }>();
    const user = useAppSelector(state => state.auth);
    const { restaurants } = useAppSelector(state => state.cart);
    const restaurantIsInCart = restaurants.find(x => x.restaurantId === restaurant._id);

    const processResponse = useCallback((res: IRestaurant) => {
        dispatch(restaurantActions.setRestaurant(res));
    }, [dispatch]);

    useEffect(() => {
        sendRequest({
            url: 'http://localhost:3030/api/restaurant/' + id
        }, processResponse);
    }, [id, sendRequest, processResponse]);
    return (
        <>
            {isLoading && <Spinner />}
            {restaurant && <RestaurantHeader user={user} />}
            {restaurant && restaurantIsInCart && restaurantIsInCart.recipes.length > 0 && <ShoppingCart />}
            <Switch>
                <Route path="/restaurant/:id/dashboard">
                    <RestaurantDashboard />
                </Route>
                <Route path="/restaurant/:id/edit">
                    {restaurant && <CreateRestaurant edit={true} />}
                </Route>
                <Route path="/">
                    {restaurant && <RestaurantCategories />}
                </Route>
            </Switch>
        </>
    );
}

export default RestaurantDetails;