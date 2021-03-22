export const requestHttp = async ( url, method, payload ) => {
	let baseUrl = 'http://localhost:4001/';
	baseUrl += url;
	const options = {
		method: method ? method : 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	};

	if (payload) {
		options.body = JSON.stringify( payload );
	}

	const response = await fetch( baseUrl, options );

	if (response.ok) {
		return url.includes( 'products' )
			? await response
			: await response.json();
	}
};
