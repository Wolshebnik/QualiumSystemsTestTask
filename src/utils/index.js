export const authValidation = ( keyInput, value ) => {

	const allVerified = {
		title: [ [ 'notEmpty' ] ],
		price: [ [ 'notEmpty' ], [ 'number' ] ],
		description: [ [ 'notEmpty' ] ],
	};

	const verificationMethods = {
		notEmpty( el ) {
			return el !== '';
		},
		number( el ) {
			return (Number.isInteger(+el))
		}
	};

	const methods = allVerified[keyInput];

	const someError = methods.map( item => {
		const [key] = item;
		return verificationMethods[key]( value);
	} );

	return someError.every( ev => ev === true );
};
