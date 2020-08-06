import React from 'react';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg'

import './styles.css';

function TeacherItem() {
	return (

		<article className="teacher-item">
			<header>
				<img src="https://avatars2.githubusercontent.com/u/56188470?s=460&u=b7bf88ccce2d718a5c9254c5152ec123c6459c9d&v=4" alt="Luis Saiete" />
				<div>
					<strong>Luis Saiete</strong>
					<span>Maths</span>
				</div>
			</header>
			<p>
				Entusiasta das melhores tecnologias de matematica avancada.

						<br /> <br />

						Apaixonado por explodir a cabeca dos estudantes com calculos complicados. Mais de 2000 Estudantes ja morreram em um dos meus exercicios.
					</p>

			<footer>
				<p>
					Preço/hora
							<strong>50,00 Mzn</strong>
				</p>

				<button type="button" >
					<img src={whatsappIcon} alt="Whatsapp" />
							Entrar em contacto.
						</button>
			</footer>

		</article>
	)
}

export default TeacherItem;
