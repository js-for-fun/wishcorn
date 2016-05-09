import request from 'request-promise';
import cheerio from 'cheerio';

export default class PornhubService {
	async getRandom() {
		// await request('')
	}
	static async getCategories() {
		const html = await request.get({
			url: 'http://www.pornhub.com/categories',
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
			},
		});

		const $ = cheerio.load(html, {
			ignoreWhitespace: true,
		});

		const results = [];

		$('.category-wrapper').each((el) => {
			results.push({
				name: $('h5 strong', el).text(),
			});
		});

		console.log(results);
		// console.log(html);
	}
}
