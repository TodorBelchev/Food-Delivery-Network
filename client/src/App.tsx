import { useEffect } from 'react';
import { Route, Switch } from 'react-router';
import './App.css';

import { useAppDispatch } from './hooks/reduxHooks';
import { authActions } from './store/auth';
import { cartActions } from './store/cart';
import loadFontAwesome from './utils/loadFontAwesome';

import Layout from './components/layout/Layout/Layout';
import Home from './pages/Home/Home';
import UserProfile from './pages/UserProfile/UserProfile';
import RestaurantDetails from './pages/RestaurantDetails/RestaurantDetails';
import City from './pages/City/City';
import MainTheme from './pages/MainTheme/MainTheme';

loadFontAwesome();

function App() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(authActions.autoLoadFavorites());
		dispatch(cartActions.autoLoadCart());
	}, [dispatch]);
	return (
		<Layout>
			<Switch>
				<Route path='/' exact>
					<Home />
				</Route>
				<Route path='/profile/:id'>
					<UserProfile />
				</Route>
				<Route path='/restaurant/:id'>
					<RestaurantDetails />
				</Route>
				<Route path='/city/:cityName'>
					<City />
				</Route>
				<Route path='/main-theme/:mainTheme'>
					<MainTheme />
				</Route>
			</Switch>
		</Layout>
	);
}

export default App;
