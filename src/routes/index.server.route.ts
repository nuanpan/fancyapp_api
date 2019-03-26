import { Express } from 'express';
import { indexController } from '../controllers/index.server.controller';
import { usersController } from '../controllers/users.controller';
import { appendFile } from 'fs';

export default class IndexRoute {
	constructor(app: Express) {
		app.route('/')
			.get(indexController.index);
		app.route('/msg')
			.get(indexController.msg);
		app.route('/users')
			.get(usersController.index);
		app.route('/users/login')
			.post(usersController.login);
		app.route('/users/login').options(usersController.login)
	}
}