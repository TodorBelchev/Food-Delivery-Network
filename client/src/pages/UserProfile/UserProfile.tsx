import { Route, Switch } from "react-router";

import CreateRestaurant from "../../components/restaurant/CreateRestaurant/CreateRestaurant";
import RestaurantList from "../../components/restaurant/RestaurantList/RestaurantList";
import HorizontalNav from "../../components/UI/HorizontalNav/HorizontalNav";
import UserData from "../../components/userProfile/UserData/UserData";

import { useAppSelector } from "../../hooks/reduxHooks";

const UserProfile: React.FC = () => {
    const user = useAppSelector(state => state.auth);

    const links: { url: string; text: string }[] = [
        { url: `/profile/${user._id}`, text: 'Profile' },
        { url: `/profile/${user._id}/create-restaurant`, text: 'Create Restaurant' },
        { url: `/profile/${user._id}/restaurants`, text: 'My restaurants' },
        { url: `/profile/${user._id}/favorites`, text: 'Favorite restaurants' },
        { url: `/profile/${user._id}/orders`, text: 'Orders' },
    ];

    return (
        <>
            <HorizontalNav links={links} />
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