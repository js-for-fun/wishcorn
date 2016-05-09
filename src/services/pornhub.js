import url from 'url';
import request from 'request-promise';
import cheerio from 'cheerio';
import _ from 'lodash';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';

const IFRAME_PATTERN = '<iframe src="http://www.pornhub.com/embed/{{vkey}}" frameborder="0" width="560" height="340" scrolling="no"></iframe>';

// const PAGE_VIDEO_COUNT = 32;

export default class PornhubService {

	static async init() {
		PornhubService.categories = await PornhubService.getCategories();
	}

	static async getRandomVideoFromCategory(category) {
		if (!_.isObject(category)) {
			throw new Error('Category should be object.');
		}
		const randomPage = Math.floor(Math.random() * 2) + 1;

		const videos = await PornhubService.getVideosByCategory(category, randomPage);
		const randomVideo = Math.floor(Math.random() * videos.length);
		return videos[randomVideo];
	}

	static async getVideosByCategory(category, page) {
		if (!_.isObject(category)) {
			throw new Error('Category should be object.');
		}

		const html = await request.get({
			url: url.resolve('http://www.pornhub.com/', category.href),
			headers: {
				'User-Agent': USER_AGENT,
			},
			qs: {
				page: page || 1,
			},
		});

		const $ = cheerio.load(html, {
			ignoreWhitespace: true,
		});

		const results = [];

		$('.videoblock').each((i, el) => {
			const vkey = $(el).attr('_vkey');
			results.push({
				name: $('a', el).attr('title'),
				href: $('a', el).attr('href'),
				img: $('img', el).attr('data-path'),
				thumbsCount: $('img', el).attr('data-thumbs'),
				vkey,
				iframe: IFRAME_PATTERN.replace('{{vkey}}', vkey),
				category: category.name,
			});
		});

		return results;
	}

	static async getCategories() {
		if (PornhubService.categories) {
			return PornhubService.categories;
		}
		const html = await request.get({
			url: 'http://www.pornhub.com/categories',
			headers: {
				'User-Agent': USER_AGENT,
			},
		});

		const $ = cheerio.load(html, {
			ignoreWhitespace: true,
		});

		const results = [];

		$('.category-wrapper').each((i, el) => {
			results.push({
				name: $('h5 strong', el).text(),
				href: $('h5 a', el).attr('href'),
				img: $('a img', el).attr('src'),
			});
		});

		return results;
	}
}
