import React from 'react';
import { useHistory } from 'react-router';

const NoMatch = () => {
	const history = useHistory();
	const home = () => {
		history.push( '/' );
	};
	return (
		<div>
			Something wrong...
			<button onClick={ home }>Home</button>
		</div>
	);
};

export default NoMatch;
