import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import CornsController from './controllers/corns';

import mongoose from 'mongoose';
import path from 'path';


export default class Server {
	constructor() {
		this.app = express();
		this.app.use(cookieParser());
		this.app.use(bodyParser());
		this.app.use((req, res, next) => {
			console.log(req.method, req.url, req.body);
			next();
		});
		this.port = 3000;

		mongoose.connect('localhost/wishcorn');
	}

	async init() {
		const cornsController = new CornsController();
		this.app.use('/corns', cornsController.router);
		this.app.use(express.static('./public'));
		this.app.get('/*', (req, res) => {
			res.sendFile(path.resolve('./public/index.html'));
		});

		await new Promise((resolve, reject) => {
			this.app.listen(this.port, err => {
				if (err) return reject(err);
				return resolve();
			});
		});
	}
}
