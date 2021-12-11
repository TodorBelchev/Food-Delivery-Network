import { Redirect, Route, Switch } from "react-router";

import { useAppSelector } from "../../../hooks/reduxHooks";

import OrdersList from "../../order/OrdersList/OrdersList";
import HorizontalNav from "../../UI/HorizontalNav/HorizontalNav"
import Statistics from "../Statistics/Statistics";

const RestaurantDashboard: React.FC = () => {
    const restaurant = useAppSelector(state => state.restaurant);
    const links: { url: string; text: string }[] = [
        { url: `/restaurant/${restaurant._id}/dashboard/statistics`, text: 'Statistics' },
        { url: `/restaurant/${restaurant._id}/dashboard/active-orders?page=1`, text: 'Active orders' },
        { url: `/restaurant/${restaurant._id}/dashboard/completed-orders?page=1`, text: 'Completed orders' },
    ];

    return (
        <>
            <HorizontalNav links={links} />
            <Switch>
                <Route path="/restaurant/:id/dashboard/" exact>
                    <Redirect to={`/restaurant/${restaurant._id}/dashboard/statistics`} />
                </Route>
                <Route path="/restaurant/:id/dashboard/statistics">
                    <Statistics />
                </Route>
                <Route path="/restaurant/:id/dashboard/active-orders">
                    <OrdersList status={'active'} />
                </Route>
                <Route path="/restaurant/:id/dashboard/completed-orders">
                    <OrdersList status={'completed'} />
                </Route>
            </Switch>
        </>
    )
};

export default RestaurantDashboard;