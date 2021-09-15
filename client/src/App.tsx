import Layout from './components/layout/Layout';

import './App.css';
import { Route, Switch } from 'react-router';
import Home from './pages/Home';

function App() {
	return (
		<Layout>
			<Switch>
				<Route path='/' exact>
					<Home></Home>
				</Route>
			</Switch>
		</Layout>
	);
}

export default App;
