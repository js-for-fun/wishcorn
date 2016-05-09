import url from 'url';
import request from 'request-promise';
import cheerio from 'cheerio';
import _ from 'lodash';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';

const IFRAME_PATTERN = '<iframe src="http://www.pornhub.com/embed/{{vkey}}" frameborder="0" width="560" height="340" scrolling="no"></iframe>';

export default class PornhubService {

	static async init() {
		PornhubService.categories = await PornhubService.getCategories();
	}

	async getRandom() {
		// await request('')
	}

	// static async getVideo(video) {
	// 	if (!_.isObject(video)) {
	// 		throw new Error('Category should be object.');
	// 	}
	//
	// 	const html = await request.get({
	// 		url: url.resolve('http://www.pornhub.com/', video.href),
	// 		headers: {
	// 			'User-Agent': USER_AGENT,
	// 		},
	// 	});
	//
	// 	const $ = cheerio.load(html, {
	// 		ignoreWhitespace: true,
	// 	});
	//
	// 	console.log($('.embed').html());
	//
	// 	return $('.embed textarea').text();
	//
	// 	// await request(video.url)
	// }

	static async getVideosByCategory(category) {
		if (!_.isObject(category)) {
			throw new Error('Category should be object.');
		}

		const html = await request.get({
			url: url.resolve('http://www.pornhub.com/', category.href),
			headers: {
				'User-Agent': USER_AGENT,
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
