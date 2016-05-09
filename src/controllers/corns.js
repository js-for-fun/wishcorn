import express from 'express';
import PornhubService from '../services/pornhub';

export default class CornsController {
	constructor() {
		this.router = new express.Router();
		this.init();
	}

	init() {
		this.router.get('/random', (...args) => {
			this.requestRandom(...args);
		});
	}

	async requestRandom(req, res) {
		try {
			await PornhubService.getCategories();
			res.send('some random');
		} catch (e) {
			console.log(e);
			next(e);
		}
	}
}
