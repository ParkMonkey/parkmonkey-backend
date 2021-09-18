import 'dotenv/config';
import 'tsconfig-paths/register';

import fastify from 'fastify';
import fastifyAutoload from 'fastify-autoload';
import path from 'path';

const app = fastify();

app.register(fastifyAutoload, {
	dir: path.join(__dirname, 'routes'),
	dirNameRoutePrefix: false,
});

app.listen(5000, (error, address) => {
	if (error) {
		// eslint-disable-next-line no-console
		console.error(error);
		throw error;
	} else {
		// eslint-disable-next-line no-console
		console.info(`ParkMonkey is listening at ${address}`);
	}
});
