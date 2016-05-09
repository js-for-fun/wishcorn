import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import CornsController from './controllers/corns';

import mongoose from 'mongoose';


export default class Server {
	constructor() {
		this.app = express();
		this.app.use(cookieParser());
		this.app.use(bodyParser());

		this.port = 3000;

		mongoose.connect('localhost/wishcorn');
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
