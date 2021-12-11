import { useEffect } from 'react';
import { Route, Switch } from 'react-router';
import './App.css';

import { useAppDispatch, useAppSelector } from './hooks/reduxHooks';
import { authActions } from './store/auth';
import { cartActions } from './store/cart';
import useHttp from './hooks/useHttp';
import loadFontAwesome from './utils/loadFontAwesome';
import IAuthState from './interfaces/IAuthState';
import { appActions } from './store/app';

import Layout from './components/layout/Layout/Layout';
import Home from './pages/Home/Home';
import UserProfile from './pages/UserProfile/UserProfile';
import RestaurantDetails from './pages/RestaurantDetails/RestaurantDetails';
import City from './pages/City/City';
import MainTheme from './pages/MainTheme/MainTheme';
import Notification from './components/UI/Notification/Notification';
import UserProfileGuard from './guards/UserProfileGuard';
import FavoriteRestaurants from './components/restaurant/FavoriteRestaurants/FavoriteRestaurants';
import userOptions from './utils/userOptions';

loadFontAwesome();

function App() {
	const { sendRequest } = useHttp();
	const dispatch = useAppDispatch();
	const notificationState = useAppSelector(state => state.notification);

	useEffect(() => {
		dispatch(authActions.autoLoadFavorites());
		dispatch(cartActions.autoLoadCart());
		sendRequest(userOptions.verify(), (res: IAuthState) => {
			dispatch(authActions.login(res));
			dispatch(appActions.initDone());
		});
	}, [dispatch, sendRequest]);
	return (
		<Layout>
			{notificationState.text && <Notification />}
			<Switch>
				<Route path='/' exact>
					<Home />
				</Route>
				<Route path='/profile/:id'>
					<UserProfileGuard>
						<UserProfile />
					</UserProfileGuard>
				</Route>
				<Route path='/restaurant/:id'>
					<RestaurantDetails />
				</Route>
				<Route path='/city/:cityName' >
					<City />
				</Route>
				<Route path='/main-theme/:mainTheme'>
					<MainTheme />
				</Route>
				<Route path='/favorites'>
					<FavoriteRestaurants />
				</Route>
			</Switch>
		</Layout>
	);
}

export default App;
