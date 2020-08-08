import React from 'react';

import PageHeader from '../../components/PageHeader';
import './styles.css';
import TeacherItem from '../../components/TeacherItem';
import Input from '../../components/Input';
import Select from '../../components/Select';





function TeacherList() {
	return (
		<div id="page-teacher-list" className="container">
			<PageHeader
				title="Estes são os Proffys disponíveis."
			>
				<form id="search-teachers" >

				<Select
						name="subject"
						label="Disciplina"
						options={[
							{ value: 'Artes', label: 'Artes' },
							{ value: 'Biologia', label: 'Biologia' },
							{ value: 'Matemática', label: 'Matemática' },
							{ value: 'Física', label: 'Física' },
							{ value: 'Química', label: 'Química' },
							{ value: 'Filosofia', label: 'Filosofia' },
							{ value: 'Inglês', label: 'Inglês' },
							{ value: 'Geografia', label: 'Geografia' },
						]}
					/>
				<Select
						name="week-day"
						label="Dia da semana"
						options={[
							{ value: '0', label: 'Domingo' },
							{ value: '1', label: 'Segunda-feira' },
							{ value: '2', label: 'Terça-feira' },
							{ value: '3', label: 'Quarta-feira' },
							{ value: '4', label: 'Quinta-feira' },
							{ value: '5', label: 'Sexta-feira' },
							{ value: '6', label: 'Sábado' },
						]}
					/>


					<Input
						name="time"
						label="Hora"
						type="time"
					/>
				</form>
			</PageHeader>

			<main>

				<TeacherItem />
				<TeacherItem />
				<TeacherItem />
				<TeacherItem />
				<TeacherItem />

			</main>
		</div>
	);
}

export default TeacherList;
