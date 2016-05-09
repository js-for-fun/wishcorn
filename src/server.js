import express from 'express';

import CornsController from './controllers/corns';

export default class Server {
	constructor() {
		this.app = express();
		this.port = 3000;
	}

	async init() {
		const cornsController = new CornsController();
		this.app.use('/corns', cornsController.router);

		await new Promise((resolve, reject) => {
			this.app.listen(this.port, err => {
				if (err) return reject(err);
				return resolve();
			});
		});
	}
}
