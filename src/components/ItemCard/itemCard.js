import React from 'react';
import { useHistory } from 'react-router';

import './itemCard.css';

const ItemCard = ( { card, deleteItem, toCart } ) => {
	const { id, title, description, price, inCart } = card;
	const history = useHistory();

	const editCard = () => {
		history.push( `/edit/${ id }` );
	};

	const deleteCard = () => {
		deleteItem( id );
	};

	const addToCart = () => {
		toCart( id );
	};

	return (
		<div className={ 'card_item' }>
			<div className={ 'card_block' }>
				<p className={ 'card_block-title' }>Title</p>
				<div className={ 'card_block-text' }>{ title }</div>
			</div>
			<div className={ 'card_block' }>
				<p className={ 'card_block-title' }>Price</p>
				<div className={ 'card_block-text' }>{ price }</div>
			</div>
			<div className={ 'card_block' }>
				<p className={ 'card_block-title' }>Description</p>
				<div className={ 'card_block-text' }>{ description }
				</div>
			</div>
			<div className={ 'card_buttons' }>
				<button onClick={ editCard }>Edit</button>
				<button onClick={ deleteCard }>Delete</button>
				<button onClick={ addToCart } disabled={ inCart }>Add to cart</button>
			</div>
		</div>
	);
};

export default ItemCard;
