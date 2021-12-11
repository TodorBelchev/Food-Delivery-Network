import { useCallback, useEffect } from "react";
import { Route, Switch, useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import useHttp from "../../hooks/useHttp";
import { restaurantActions } from "../../store/restaurant";
import IRestaurant from "../../interfaces/IRestaurant";
import restaurantOptions from "../../utils/restaurantOptions";

import CreateRestaurant from "../../components/restaurant/CreateRestaurant/CreateRestaurant";
import RestaurantCategories from "../../components/restaurant/RestaurantCategories/RestaurantCategories";
import RestaurantDashboard from "../../components/restaurant/RestaurantDashboard/RestaurantDashboard";
import RestaurantHeader from "../../components/restaurant/RestaurantHeader/RestaurantHeader";
import Spinner from "../../components/UI/Spinner/Spinner";
import ShoppingCart from "../../components/shoppingCart/ShoppingCart/ShoppingCart";
import IsOwner from "../../guards/IsOwner";


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
        sendRequest(restaurantOptions.getById(id), processResponse);
        return () => {
            dispatch(restaurantActions.clearRestaurant());
        };
    }, [id, sendRequest, processResponse, dispatch]);

    return (
        <>
            {isLoading && <Spinner />}
            {restaurant._id && !isLoading && <RestaurantHeader user={user} />}
            <Switch>
                <Route path="/restaurant/:id/dashboard">
                    {!isLoading && restaurant._id &&
                        <IsOwner restaurant={restaurant} >
                            <RestaurantDashboard />
                        </IsOwner>}
                </Route>
                <Route path="/restaurant/:id/edit">
                    {restaurant._id && restaurant._id &&
                        <IsOwner restaurant={restaurant} >
                            <CreateRestaurant edit={true} />
                        </IsOwner>}
                </Route>
                <Route path="/">
                    {restaurant._id &&
                        !isLoading &&
                        <RestaurantCategories categories={restaurant.categories} recipes={restaurant.recipes} />}
                    {restaurant._id &&
                        !isLoading &&
                        restaurantIsInCart &&
                        restaurantIsInCart.recipes.length > 0 &&
                        <ShoppingCart />}
                </Route>
            </Switch>
        </>
    );
}

export default RestaurantDetails;