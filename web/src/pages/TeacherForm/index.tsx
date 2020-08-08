import React from 'react';
import PageHeader from '../../components/PageHeader';

import warningIcon from '../../assets/images/icons/warning.svg';

import './styles.css';
import Input from '../../components/Input';

function TeacherForm() {
	return (
		<div id="page-teacher-form" className="container">
			<PageHeader
				title="Que Incrível que você quer dar aulas."
				description="O primeiro passo é preencher esse formulário de inscrição."
			/>

			<main>
				<fieldset>
					<legend>Seus dados</legend>

					<Input
						name="name"
						label="Nome completo"
					/>
					<Input
						name="avatar"
						label="Avatar"
					/>
					<Input
						name="whatsapp"
						label="Whatsapp"
					/>
				</fieldset>

				<fieldset>
					<legend>Sobre a aula</legend>

					<Input
						name="subject"
						label="Disciplina"
					/>
					<Input
						name="cost"
						label="Custo da sua aula por hora"
					/>
				</fieldset>

				<footer>
					<p>
						<img src={warningIcon} alt="Aviso importante"/>
						Importante! <br />
						Preencha todos os dados
					</p>

					<button type="button" >
						Salvar cadastro.
					</button>
				</footer>
			</main>
		</div>
	);
}

export default TeacherForm;
