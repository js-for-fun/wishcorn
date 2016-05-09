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
		} catch (e) {
			console.log(e);
			throw e;
		}
		this.router.get('/random', (...args) => {
			this.requestRandom(...args);
		});
	}

	predictCategory(categories) {
		const keys = Object.keys(categories);
		const sum = keys.reduce((ac, item) => ac + categories[item], 0);
		for (let i = 0; i < keys.length; ++i) {
			const key = keys[i];
			const probability = categories[key] / sum;
			if (probability > Math.random()) {
				return key;
			}
		}
		return keys[keys.length - 1];
	}

	async requestRandom(req, res) {
		try {
			const videos = await PornhubService.getRandomVideoFromCategory(PornhubService.categories[1]);
			res.send(videos);
		} catch (e) {
			console.log(e);
			next(e);
		}
	}
}
