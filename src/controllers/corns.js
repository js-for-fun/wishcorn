import express from 'express';

export default class CornsController {
	constructor() {
		this.router = new express.Router();
		this.init();
	}

	init() {
		this.router.get('/random', this.requestRandom);
	}

	requestRandom(req, res) {
		res.send('some random');
	}
}
