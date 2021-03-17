import React from 'react';

import './itemInput.css';

const ItemInput = ( { name, type, value, change, textArea, error } ) => {
	const options = {
		'className': textArea ? `edit-label-textArea ${error ? 'error-border': ''}` :
			`edit-label-input ${error ? 'error-border': ''}`,
		type, name, value, rows: '10',
		onChange: change
	};
	const {rows, ...rest} = options;
	const area = textArea ? <textarea { ...options }/> : <input { ...rest }/>;

	return (
		<div className={ 'edit' }>
			<label className={ `edit-label` }>
				<span className={ `edit-label-title` }>{ name }</span>
				{ area }
			<span className={ `edit-error` }>{ error }</span>
			</label>
		</div>
	);
};

export default ItemInput;
