import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { requestHttp } from '../../httpRequest';

import './cartView.css';
import { catchException } from '../../utils';

const countSum = ( array ) => {
	return array.reduce( ( prev, next ) => prev + (next.price * next.quantity), 0 );
};

const Cart = () => {
	const history = useHistory();
	const [ cart, setCart ] = useState( [] );
	const [ totalSum, setTotalSum ] = useState( 0 );

	useEffect( () => {
			requestHttp( 'cart' ).then( response => {
				setCart( response );
				setTotalSum( countSum( response ) );
			} )
			.catch(e => catchException(e,history.push ) );

	}, [ history ] );

	const increase = ( id ) => {
		let num = 0;
		const array = cart.map( item => {
			if (item.id === id) {
				num = ++item.quantity;
				return { ...item, quantity: num };
			} else {
				return item;
			}
		} );

			requestHttp( `cart/${ id }`, 'PATCH', { quantity: num } )
			.catch(e => catchException(e,history.push ) );
			setCart( array );
			setTotalSum( countSum( array ) );
	};

	const decrease = ( id ) => {
		let num = 0;
		const array = cart.map( item => {
			if (item.id === id && item.quantity > 1) {
				num = --item.quantity;
				return { ...item, quantity: num };
			} else {
				return item;
			}
		} );

			requestHttp( `cart/${ id }`, 'PATCH', { quantity: num } )
			.catch(e => catchException(e,history.push ) );
			setCart( array );
			setTotalSum( countSum( array ) );
	};

	const removeItem = ( id ) => {
			requestHttp( `cart/${ id }`, 'DELETE' )
			.catch(e => catchException(e,history.push ) );

			requestHttp( `products/${ id }`, 'PATCH', { inCart: false } )
			.catch(e => catchException(e,history.push ) );

			const cartWithoutItem = cart.filter( item => item.id !== id );
			setCart( cartWithoutItem );
			setTotalSum( countSum( cartWithoutItem ) );
	};

	const goBack = () => {
		history.goBack();
	};

	return (
		<div>
			<table className="blueTable">
				<thead>
				<tr>
					<th>Title</th>
					<th>Description</th>
					<th>Quantity</th>
					<th>Price</th>
					<th>Summary</th>
					<th>&nbsp;</th>
					<th>&nbsp;</th>
					<th>&nbsp;</th>
				</tr>
				</thead>
				<tfoot>
				<tr>
					<td colSpan="8">
						<div className="links">
							<div className="active">{ totalSum }</div>
						</div>
					</td>
				</tr>
				</tfoot>
				<tbody>
				{ cart.map( ( item ) => {
					return (
						<tr key={ item.id }>
							<td>{ item.title }</td>
							<td>{ item.description }</td>
							<td>{ item.quantity }</td>
							<td>{ item.price }</td>
							<td>{ item.price * item.quantity }</td>
							<td>
								<button
									onClick={ () => increase( item.id ) }
								>Increase</button>
							</td>
							<td>
								<button
									onClick={ () => decrease( item.id ) }
								>Decrease</button>
							</td>
							<td>
								<button
									onClick={ () => removeItem( item.id ) }
								>Delete</button>
							</td>
						</tr>);
				} ) }
				</tbody>
			</table>
			<div className={ 'back' }>

				<button onClick={ goBack }>Back</button>
			</div>
		</div>
	);
};

export default Cart;
