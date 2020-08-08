import React from 'react';

import './styles.css';

function Input() {

	return (
		<div className="input-block">
			<label htmlFor="subject">Disciplina</label>
			<input type="text" id="subject" />
		</div>
	);

}

export default Input;
