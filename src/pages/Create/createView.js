import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';

import { ItemInput } from '../../components';
import { requestHttp } from '../../httpRequest';
import { authValidation, catchException } from '../../utils';

import './createView.css';

const CreateCard = () => {
	const match = useRouteMatch();
	const history = useHistory();
	const [ disabled, setDisabled ] = useState( true );
	const [ error, setError ] = useState( {
		title: '',
		price: '',
		description: ''
	} );
	const [ card, setCard ] = useState( {
		title: '',
		price: '',
		description: '',
		inCart: false
	} );

	useEffect( () => {
		if (match.params.id) {
			requestHttp( `products/${ match.params.id }` )
			.then( res => res.json() ).then( res => setCard( res ) )
			.catch( e => catchException( e, history.push ) );
		}
	}, [ history, match.params.id ] );

	useEffect( () => {
		if (!error.title && !error.price && !error.description) {
			setDisabled( false );
		} else {
			setDisabled( true );
		}
	}, [ error.title, error.price, error.description ] );

	const changeInput = ( event ) => {
		const verified = authValidation( event.target.name, event.target.value );

		setCard( { ...card, [event.target.name]: event.target.value } );
		if (verified) {
			setError( { ...error, [event.target.name]: '' } );
		} else {
			const errorText = (event.target.name === 'price') ? 'Only number' : 'Error';
			setError( { ...error, [event.target.name]: errorText } );
		}
	};

	const goBack = ( e ) => {
		e.preventDefault();
		history.goBack();
	};

	const submit = ( e ) => {
		e.preventDefault();
		if (!card.title || !card.price || !card.description) {
			alert( 'Fields must not be empty' );
			return;
		}
		if (match.params.id) {
			requestHttp( `products/${ match.params.id }`, 'PATCH', card )
			.catch( e => catchException( e, history.push ) );

			requestHttp( `cart/${ match.params.id }`, 'PATCH', card )
			.catch( e => catchException( e, history.push ) );
		} else {
			requestHttp( 'products', 'POST', card )
			.catch( e => catchException( e, history.push ) );
		}
		history.push( '/' );
	};

	return (
		<form className={ 'edit_form' } onSubmit={ submit }>
			<div className={ 'wrapper' }>
				<ItemInput
					name={ 'title' }
					type={ 'text' }
					value={ card.title }
					change={ changeInput }
					error={ error.title }
				/>
				<ItemInput
					name={ 'price' }
					type={ 'text' }
					value={ card.price }
					change={ changeInput }
					error={ error.price }
				/>
				<ItemInput
					name={ 'description' }
					type={ 'text' }
					value={ card.description }
					change={ changeInput }
					error={ error.description }
					textArea
				/>
			</div>
			<div className={ 'button-block' }>
				<button disabled={ disabled }>Save</button>
				<button onClick={ goBack }>Back</button>
			</div>

		</form>
	);
};

export default CreateCard;
