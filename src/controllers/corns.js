import express from 'express';
import PornhubService from '../services/pornhub';

export default class CornsController {
	constructor() {
		this.router = new express.Router();
		this.init();
	}

	async init() {
		try {
			await PornhubService.init();
		} catch(e) {
			console.log(e);
			throw e;
		}
		this.router.get('/random', (...args) => {
			this.requestRandom(...args);
		});
	}

	async requestRandom(req, res) {
		try {
			const videos = await PornhubService.getVideosByCategory(PornhubService.categories[0]);
			res.send(videos);
		} catch (e) {
			console.log(e);
			next(e);
		}
	}
}
