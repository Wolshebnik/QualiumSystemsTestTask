import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { requestHttp } from '../../httpRequest';
import { ItemCard } from '../../components';
import { catchException } from '../../utils';

import './main.css';

const createArrayOfPages = ( totalRecords ) => {
	let paginationPages = Math.floor( totalRecords / 10 ) + (totalRecords % 10 === 0 ? 0 : 1);
	let arrayPages = [];
	for (let i = 1; i <= paginationPages; i++) {
		arrayPages.push( i );
	}
	return arrayPages;
};

const Main = () => {
	const history = useHistory();
	const [ cards, setCards ] = useState( [] );
	const [ inputSearch, setInputSearch ] = useState( '' );
	const [ numberOfPage, setNumberOfPage ] = useState( [] );
	const [ currentPage, setCurrentPage ] = useState( 1 );


	useEffect( () => {
		if (!inputSearch) {
			requestHttp(  `products?_page=${ currentPage }&_limit=10` )
			.then( res => {
				const totalRecords = res.headers.get( 'X-Total-Count' );
				setNumberOfPage( createArrayOfPages( totalRecords ) );
				return res.json();
			} )
			.then( response => {
				setCards( response );
			} )
			.catch( e => catchException( e, history.push ) );
		}
	}, [ history, currentPage, inputSearch ] );

	const moveToPage = ( event ) => {
		event.target.name === 'toCreate'
			? history.push( '/create' )
			: history.push( '/cart' );
	};

	const deleteItem = async ( id ) => {
		let findCard = cards.find( item => item.id === id );

		await requestHttp(`products/${ id }`, 'DELETE' )
		.catch( e => catchException( e, history.push ) );

		findCard.inCart && await requestHttp(`cart/${ id }`, 'DELETE' )
		.catch( e => catchException( e, history.push ) );

		const cardsWithoutDeleted = cards.filter( item => item.id !== id );
		setCards( cardsWithoutDeleted );
		setInputSearch( '' );


	};

	const addToCart = async ( id ) => {
		const findToCart = cards.find( item => item.id === id );
		let { inCart, ...rest } = findToCart;
		inCart = true;

		await requestHttp(`products/${ id }`, 'PUT', { ...rest, inCart } )
		.catch( e => catchException( e, history.push ) );

		await requestHttp(`cart`, 'POST', { ...rest, quantity: 1 } )
		.catch( e => catchException( e, history.push ) );

		const cardsWithCart = cards.map( item => item.id === id ? { ...rest, inCart } : item );
		setCards( cardsWithCart );
	};

	const dataSearch = ( event ) => {
		const text = event.target.value.toLowerCase();
		setInputSearch( text );
		if (text) {
			requestHttp(`products?title_like=${ text }` )
			.then( res => res.json() )
			.then( res => {
				setNumberOfPage( createArrayOfPages( res.length ) );
				setCards( res );
			} )
			.catch( e => catchException( e, history.push ) );
		}
	};

	const changePage = ( page ) => {
		setCurrentPage( page );
	};

	return (
		<div>
			<div className={ 'create_card' }>
				<button onClick={ moveToPage } name={ 'toCreate' }>Create card</button>
				<button onClick={ moveToPage }>To Cart</button>
			</div>

			<div className={ 'search' }>
				<label>
					<span>Title</span>
					<input type="text" value={ inputSearch } onChange={ dataSearch }/>
				</label>
			</div>
			<div className={ 'pagination' }>
				{ numberOfPage.map( ( item, idx ) => {
					return (
						<div
							key={ idx }
							className={ `pagination_page-button ${ currentPage === item ? 'activePage' : '' }` }
							onClick={ () => changePage( item ) }>
							{ item }
						</div>
					);
				} ) }
			</div>

			<div className={ 'cards' }>
				{ cards.map( card => {
					return <ItemCard
						key={ card.id }
						card={ card }
						deleteItem={ deleteItem }
						toCart={ addToCart }
					/>;
				} ) }
			</div>
			<div className={ 'pagination' }>
				{ numberOfPage.map( ( item, idx ) => {
					return (
						<div
							key={ idx }
							className={ `pagination_page-button ${ currentPage === item ? 'activePage' : '' }` }
							onClick={ () => changePage( item ) }>
							{ item }
						</div>
					);
				} ) }
			</div>
		</div>
	);
};

export default Main;
