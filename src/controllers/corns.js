import express from 'express';
import PornhubService from '../services/pornhub';
import _ from 'lodash';

import User from '../models/users';

export default class CornsController {
	constructor() {
		this.router = new express.Router();
		this.init();
	}

	async init() {
		await PornhubService.init();
		this.router.use(this.getOrCreateMiddleware.bind(this));
		this.router.get('/random', this.requestRandom.bind(this));
		this.router.post('/increment', this.requestIncrement.bind(this));
	}

	predictCategory(categories) {
		const keys = _.shuffle(Object.keys(categories));
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

	async requestIncrement(req, res, next) {
		const categoryName = req.body.category;
		if (!_.find(PornhubService.categories, { name: categoryName })) {
			return next('Unknown category!');
		}
		await User.update({
			_id: req.user._id,
		}, {
			$inc: {
				[`categories.${categoryName}`]: 1,
			},
		});

		return res.send({ ok: true });
	}

	async getOrCreateMiddleware(req, res, next) {
		let user;

		if (!req.cookies.id) {
			const userCategories = PornhubService.categories.reduce((ac, item) => {
				ac[item.name] = 1;
				return ac;
			}, {});

			user = await User.createUser({
				categories: userCategories,
			});
			req.user = user;
			res.cookie('id', user._id);
		} else {
			user = await User.findOne({ _id: req.cookies.id }).lean();
			req.user = user;
			if (!user) next(new Error('Fuck you!'));
		}
		next();
	}

	async requestRandom(req, res, next) {
		const categoryName = this.predictCategory(req.user.categories);
		const category = _.find(PornhubService.categories, { name: categoryName });
		if (!category) {
			return next('Unknown category.');
		}
		try {
			const videos = await PornhubService.getRandomVideoFromCategory(category);
			return res.send(videos);
		} catch (e) {
			console.log(e);
			return next(e);
		}
	}
}
