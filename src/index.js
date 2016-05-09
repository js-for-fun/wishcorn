import Server from './server';

class Main {
	static async start() {
		try {
			const server = new Server();

			await server.init();
			console.log('Server has started.');
		} catch (e) {
			console.log(e);
		}
	}
}

Main.start();
