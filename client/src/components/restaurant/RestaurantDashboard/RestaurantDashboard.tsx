import { Redirect, Route, Switch } from "react-router";

import { useAppSelector } from "../../../hooks/reduxHooks";

import ActiveOrdersList from "../../order/ActiveOrdersList/ActiveOrdersList";
import HorizontalNav from "../../UI/HorizontalNav/HorizontalNav"

const RestaurantDashboard: React.FC = () => {
    const restaurant = useAppSelector(state => state.restaurant);
    const links: { url: string; text: string }[] = [
        { url: `/restaurant/${restaurant._id}/dashboard/statistics`, text: 'Statistics' },
        { url: `/restaurant/${restaurant._id}/dashboard/active-orders`, text: 'Active orders' },
        { url: `/restaurant/${restaurant._id}/dashboard/completed-orders`, text: 'Completed orders' },
    ];

    return (
        <div className={`container`}>
            <HorizontalNav links={links} />
            <Switch>
                <Route path="/restaurant/:id/dashboard/" exact>
                    <Redirect to={`/restaurant/${restaurant._id}/dashboard/statistics`} />
                </Route>
                <Route path="/restaurant/:id/dashboard/statistics">
                    <div>Statistics</div>
                </Route>
                <Route path="/restaurant/:id/dashboard/active-orders">
                    <ActiveOrdersList />
                </Route>
                <Route path="/restaurant/:id/dashboard/completed-orders">
                    <div>Completed orders</div>
                </Route>
            </Switch>
        </div>
    )
};

export default RestaurantDashboard;