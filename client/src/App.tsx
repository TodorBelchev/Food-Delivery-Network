import Layout from './components/layout/Layout/Layout';

import './App.css';
import { Route, Switch } from 'react-router';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';

function App() {
	return (
		<Layout>
			<Switch>
				<Route path='/' exact>
					<Home />
				</Route>
				<Route path='/profile/:id'>
					<UserProfile />
				</Route>
			</Switch>
		</Layout>
	);
}

export default App;
