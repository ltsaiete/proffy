import express from 'express';
import db from './database/connection';

const routes = express.Router();

routes.post('/classes', async (request, response) => {
	const {
		name,
		avatar,
		whatsapp,
		bio,
		subject,
		cost,
		schedule
	} = request.body;

	const [insertedUsersIds] = await db('users')
		.insert({
			name,
			avatar,
			whatsapp,
			bio,
		});

	await db('classes')
		.insert({
			subject,
			cost,
			user_id: insertedUsersIds,
		})

	return response.send();
});

export default routes;
