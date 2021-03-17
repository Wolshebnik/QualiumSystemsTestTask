import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import { Cart, Create, Main, NoMatch } from './pages';

function App() {
	return (
		<div className={ 'main' }>
			<Router>
				<Switch>
					<Route exact path="/">
						<Main/>
					</Route>
					<Route path="/create">
						<Create/>
					</Route>
					<Route path="/edit/:id">
						<Create/>
					</Route>
					<Route path="/cart">
						<Cart/>
					</Route>
					<Route path="**">
						<NoMatch/>
					</Route>
				</Switch>
			</Router>
		</div>
	);
}

export default App;
