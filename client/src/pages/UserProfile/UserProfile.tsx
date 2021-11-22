import { Route, Switch } from "react-router";

import CreateRestaurant from "../../components/restaurant/CreateRestaurant/CreateRestaurant";
import RestaurantList from "../../components/restaurant/RestaurantList/RestaurantList";
import UserData from "../../components/user-profile/UserData/UserData";
import UserNav from "../../components/user-profile/UserNav/UserNav";

import { useAppSelector } from "../../hooks/redux-hooks";

const UserProfile: React.FC = () => {
    const user = useAppSelector(state => state.auth);

    return (
        <>
            <UserNav user={user} />
            <Switch>
                <Route path="/profile/:id/" exact>
                    <UserData edit={false} />
                </Route>
                <Route path="/profile/:id/create-restaurant">
                    <CreateRestaurant edit={false} />
                </Route>
                <Route path="/profile/:id/restaurants">
                    <RestaurantList />
                </Route>
            </Switch>
        </>
    );
}

export default UserProfile;